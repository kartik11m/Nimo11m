import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function EditCourseButton({ course, onCourseUpdated, onCourseDeleted }) {
  const { isOwner, token } = useOwnerAuth()
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: course.title,
    sub: course.sub,
    level: course.level,
    category: course.category,
    description: course.description,
    duration: course.duration,
    sessions: course.sessions,
    students: course.students,
    modules: course.modules.join('\n'),
    price: course.price,
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const modules = formData.modules.split('\n').filter(m => m.trim())
      const res = await fetch(`${API_URL}/courses/${course.courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          modules,
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert('Course updated successfully!')
        setShowForm(false)
        if (onCourseUpdated) onCourseUpdated(data.course)
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error updating course')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/courses/${course.courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (data.success) {
        alert('Course deleted successfully!')
        setShowDeleteConfirm(false)
        if (onCourseDeleted) onCourseDeleted(course.courseId)
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowForm(true)}
          className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30"
          title="Edit course"
        >
          ✎
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-2 py-1 text-xs font-semibold rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30"
          title="Delete course"
        >
          🗑
        </button>
      </div>

      {/* Edit Form Modal */}
      {showForm && portalRoot && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Course</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="sub"
                    value={formData.sub}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  >
                    <option value="hardware">Hardware</option>
                    <option value="software">Software & AI</option>
                    <option value="robotics">Robotics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 8 Weeks"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Sessions</label>
                  <input
                    type="text"
                    name="sessions"
                    value={formData.sessions}
                    onChange={handleInputChange}
                    placeholder="e.g., 24 Sessions"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Students</label>
                  <input
                    type="text"
                    name="students"
                    value={formData.students}
                    onChange={handleInputChange}
                    placeholder="e.g., 2,400+"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Course Modules (one per line)</label>
                <textarea
                  name="modules"
                  value={formData.modules}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none font-mono text-xs"
                  rows="6"
                  placeholder="Module 1&#10;Module 2&#10;Module 3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Saving...' : 'Save Course'}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && portalRoot && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-300 mb-4">
              Are you sure you want to delete "{course.title}"? This action cannot be undone.
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
