import { useOwnerAuth } from '../context/OwnerAuthContext'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ChapterHeader({ color, label, chapterId, onChapterUpdate, onChapterDelete }) {
  const { isOwner, token } = useOwnerAuth()
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    color: color,
    rgb: '',
  })
  const [loading, setLoading] = useState(false)
  const [portalRoot] = useState(() => {
    if (typeof document === 'undefined') return null
    let root = document.getElementById('modal-root')
    if (!root) {
      root = document.createElement('div')
      root.id = 'modal-root'
      document.body.appendChild(root)
    }
    return root
  })

  const handleEdit = async () => {
    try {
      const res = await fetch(`${API_URL}/chapters/${chapterId}`)
      const data = await res.json()
      if (data.success) {
        const chapter = data.chapter
        setFormData({
          name: chapter.name,
          displayName: chapter.displayName,
          description: chapter.description || '',
          color: chapter.color,
          rgb: chapter.rgb,
        })
        setShowForm(true)
      }
    } catch (error) {
      console.error('Error fetching chapter:', error)
      alert('Error loading chapter details')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        alert('Chapter updated successfully!')
        setShowForm(false)
        if (onChapterUpdate) onChapterUpdate(data.chapter)
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error updating chapter')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        alert('Chapter deleted successfully!')
        setShowDeleteConfirm(false)
        if (onChapterDelete) onChapterDelete(chapterId)
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting chapter')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-12 py-5 border-y border-white/[.055] bg-white/[.015]">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-8 h-px flex-shrink-0" style={{ background: color }} />
          <span className="text-[8px] font-bold tracking-[.45em] uppercase text-[#F0EAD6]/25" style={{ fontFamily: "'Syne', sans-serif" }}>
            {label}
          </span>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/30"
            >
              ✎ Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Form Modal - Rendered in Portal */}
      {showForm && portalRoot && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Edit Chapter</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Chapter Name"
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Display Name"
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Chapter Description"
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded border border-white/20 cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        portalRoot
      )}

      {/* Delete Confirmation Modal - Rendered in Portal */}
      {showDeleteConfirm && portalRoot && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Delete Chapter?</h3>
            <p className="text-sm text-gray-300 mb-4">
              This will delete the chapter. Videos in this chapter will be preserved but not accessible.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        portalRoot
      )}
    </>
  )
}
