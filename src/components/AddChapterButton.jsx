import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AddChapterButton({ onChapterAdded }) {
  const { isOwner, token } = useOwnerAuth()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    chapterId: '',
    name: '',
    displayName: '',
    description: '',
    color: '#FF6B35',
    rgb: '255,107,53',
  })
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

  if (!isOwner) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (e) => {
    const color = e.target.value
    // Extract RGB values from color
    const rgb = parseInt(color.slice(1), 16)
    const r = (rgb >> 16) & 255
    const g = (rgb >> 8) & 255
    const b = rgb & 255
    setFormData(prev => ({ ...prev, color, rgb: `${r},${g},${b}` }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        alert('Chapter created successfully! Refreshing...')
        setShowForm(false)
        setFormData({
          chapterId: '',
          name: '',
          displayName: '',
          description: '',
          color: '#FF6B35',
          rgb: '255,107,53',
        })
        if (onChapterAdded) onChapterAdded(data.chapter)
        // Refresh page after short delay
        setTimeout(() => window.location.reload(), 1000)
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating chapter')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="px-6 py-3 text-sm font-bold rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white hover:from-[#FF8A50] hover:to-[#FFA070] transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        + Add New Chapter
      </button>

      {/* Form Modal - Rendered in Portal */}
      {showForm && portalRoot && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Create New Chapter</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Chapter ID *</label>
                  <input
                    type="text"
                    name="chapterId"
                    value={formData.chapterId}
                    onChange={handleInputChange}
                    placeholder="e.g., ch4"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Unique identifier like ch4, ch5</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Chapter Four"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Display Name *</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="e.g., Chapter Four · Advanced Topics · Optimization"
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">This appears in the chapter header. Use · to separate topics</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of this chapter..."
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Chapter Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={handleColorChange}
                    className="w-12 h-12 rounded border border-white/20 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Selected: {formData.color}</p>
                    <p className="text-xs text-gray-500">RGB: {formData.rgb}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 text-xs text-blue-300">
                <strong>Note:</strong> The page will automatically refresh after creating the chapter so you can see it immediately.
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white rounded font-semibold hover:from-[#FF8A50] hover:to-[#FFA070] disabled:opacity-50 transition-all"
                >
                  {loading ? 'Creating...' : 'Create Chapter'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded font-semibold hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        portalRoot
      )}
    </>
  )
}
