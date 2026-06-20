import { useState, useEffect } from 'react'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ChapterManager() {
  const { isOwner, token } = useOwnerAuth()
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [formData, setFormData] = useState({
    chapterId: '',
    name: '',
    displayName: '',
    description: '',
    color: '#FF6B35',
    rgb: '255,107,53',
  })

  if (!isOwner) return null

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${API_URL}/chapters`)
        const data = await res.json()
        if (data.success) {
          setChapters(data.chapters)
        }
      } catch (error) {
        console.error('Error fetching chapters:', error)
      }
    }
    fetchChapters()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingChapter
        ? `${API_URL}/chapters/${editingChapter.chapterId}`
        : `${API_URL}/chapters`
      
      const method = editingChapter ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        if (editingChapter) {
          setChapters(chapters.map(ch => 
            ch.chapterId === editingChapter.chapterId ? data.chapter : ch
          ))
          alert('Chapter updated successfully!')
        } else {
          setChapters([...chapters, data.chapter])
          alert('Chapter created successfully!')
        }
        resetForm()
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving chapter')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (chapterId) => {
    if (!confirm('Delete this chapter? (Videos in this chapter will be preserved but not accessible)')) {
      return
    }

    try {
      const res = await fetch(`${API_URL}/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        setChapters(chapters.filter(ch => ch.chapterId !== chapterId))
        alert('Chapter deleted successfully!')
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting chapter')
    }
  }

  const handleEdit = (chapter) => {
    setEditingChapter(chapter)
    setFormData({
      chapterId: chapter.chapterId,
      name: chapter.name,
      displayName: chapter.displayName,
      description: chapter.description || '',
      color: chapter.color,
      rgb: chapter.rgb,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setEditingChapter(null)
    setFormData({
      chapterId: '',
      name: '',
      displayName: '',
      description: '',
      color: '#FF6B35',
      rgb: '255,107,53',
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Manage Chapters</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-opacity-90"
            style={{ backgroundColor: '#FF6230' }}
          >
            + Add Chapter
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg space-y-4 border border-white/20">
          <h3 className="text-lg font-semibold text-white">
            {editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Chapter ID (e.g., ch4)</label>
              <input
                type="text"
                name="chapterId"
                value={formData.chapterId}
                onChange={handleInputChange}
                disabled={!!editingChapter}
                placeholder="ch4"
                className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Chapter Four"
                className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Chapter Four · Advanced Topics"
                className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Color (Hex)</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="#FF6B35"
                className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe this chapter..."
                rows="3"
                className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? 'Saving...' : editingChapter ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map(chapter => (
          <div
            key={chapter.chapterId}
            className="bg-white/10 border border-white/20 rounded-lg p-4 space-y-3"
            style={{ borderLeftColor: chapter.color, borderLeftWidth: '4px' }}
          >
            <div>
              <h3 className="font-bold text-white">{chapter.displayName}</h3>
              <p className="text-sm text-gray-400">ID: {chapter.chapterId}</p>
            </div>

            {chapter.description && (
              <p className="text-sm text-gray-300">{chapter.description}</p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(chapter)}
                className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(chapter.chapterId)}
                className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
