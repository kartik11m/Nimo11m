import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function CardActions({ cardType, cardId, cardData, onCardAdded, onCardDeleted, showAddButton = false, showEditDelete = false }) {
  const { isOwner, addCard, deleteCard, updateCard } = useOwnerAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(cardData || {})
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

  const templates = {
    achievement: {
      id: Math.floor(Math.random() * 10000),
      init: "XX",
      name: "New Student",
      city: "Bhopal",
      robot: "Your Robot",
      type: "project",
      title: "Your Achievement Title",
      sub: "Achievement subtitle",
      quote: "Share your achievement quote here.",
      tags: ["Tag1", "Tag2"],
      level: "Beginner",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    robot: {
      emoji: "🤖",
      color: "#FF6B35",
      rgb: "255,107,53",
      type: "New Robot Type",
      name: "New Robot",
      built: "0+ students",
      level: "Beginner",
      desc: "Add a description for your new robot.",
      specs: ["Spec 1", "Spec 2", "Spec 3"]
    },
    star: {
      init: "XX",
      name: "New Star",
      city: "Bhopal",
      spec: "Specialty",
      color: "#FF6B35",
      achs: 0,
      tags: ["Tag1"]
    },
    testimonial: {
      q: "Add your testimonial here.",
      name: "New Testimonial",
      role: "Role/Position",
      color: "#FF6B35",
      init: "XX"
    },
    cert: {
      icon: "🏅",
      txt: "New Certification",
      color: "#FF6B35"
    },
    lab: {
      name: "New Lab",
      icon: "⚗️",
      color: "#FF6B35",
      rgb: "255,107,53",
      tagline: "Lab tagline",
      desc: "Lab description",
      area: "Space required",
      capacity: "Student capacity",
      timeline: "Setup timeline",
      equipment: ["Equipment 1"],
      suited: ["school"],
      tier: "Core"
    },
    process: {
      step: "0X",
      title: "Process Step",
      icon: "📋",
      color: "#FF6B35",
      rgb: "255,107,53",
      desc: "Step description"
    },
    package: {
      name: "New Package",
      subtitle: "Package subtitle",
      color: "#FF6B35",
      rgb: "255,107,53",
      price: "Price",
      includes: ["Feature 1"],
      suited: "Target audience",
      highlight: false
    },
    whyus: {
      icon: "⭐",
      title: "Why Us",
      color: "#FF6B35",
      rgb: "255,107,53",
      body: "Value proposition"
    },
    blog: {
      tag: "Tutorial",
      cat: "hardware",
      title: "Blog Title",
      excerpt: "Blog excerpt",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      readTime: "5 min",
      color: "#FF6B35",
      rgb: "255,107,53",
      featured: false
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const template = templates[cardType] || {}
      await addCard(cardType, template, 'achievements')
      onCardAdded?.()
      setShowAddForm(false)
      alert(`New ${cardType} added! Refreshing...`)
      setTimeout(() => window.location.reload(), 1000)
    } catch (err) {
      console.error('Add failed:', err)
      alert('Failed to add card')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Merge formData with original cardData to preserve non-editable fields (like arrays)
      const mergedData = { ...cardData, ...formData }
      await updateCard(cardId, mergedData)
      setShowEditForm(false)
      alert('Card updated successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (err) {
      console.error('Update failed:', err)
      alert('Failed to update card')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteCard(cardId)
      setShowDeleteConfirm(false)
      alert('Card deleted successfully!')
      onCardDeleted?.()
      setTimeout(() => window.location.reload(), 1000)
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete card')
    } finally {
      setLoading(false)
    }
  }

  // Add button (standalone)
  if (showAddButton) {
    return (
      <>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white hover:from-[#FF8A50] hover:to-[#FFA070] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          + Add {cardType}
        </button>

        {showAddForm && portalRoot && createPortal(
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">Add New {cardType}</h3>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white font-bold rounded hover:from-[#FF8A50] hover:to-[#FFA070] disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Card'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 bg-white/10 text-white font-bold rounded border border-white/20 hover:bg-white/20"
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

  // Edit/Delete buttons (on hover)
  if (showEditDelete) {
    return (
      <>
        <div className="flex gap-1">
          <button
            onClick={() => setShowEditForm(true)}
            className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 transition-all"
            title="Edit card"
          >
            ✎
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-2 py-1 text-xs font-semibold rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition-all"
            title="Delete card"
          >
            🗑
          </button>
        </div>

        {/* Edit Form Modal */}
        {showEditForm && portalRoot && createPortal(
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Edit {cardType}</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {Object.entries(formData).map(([key, value]) => {
                  if (typeof value === 'object' || key === 'id') return null
                  return (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                      />
                    </div>
                  )
                })}
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white font-bold rounded hover:from-[#FF8A50] hover:to-[#FFA070] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 px-4 py-2 bg-white/10 text-white font-bold rounded border border-white/20 hover:bg-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          portalRoot
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && portalRoot && createPortal(
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Delete Confirmation</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to delete this {cardType}? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white/10 text-white font-bold rounded border border-white/20 hover:bg-white/20"
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

  return null
}
