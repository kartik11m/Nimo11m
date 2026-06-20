import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AddCourseButton({ onCourseAdded }) {
  const { isOwner, token } = useOwnerAuth()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    sub: '',
    level: 'beginner',
    category: 'hardware',
    description: '',
    duration: '',
    sessions: '',
    students: '',
    modules: '',
    price: '',
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
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
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
        alert('Course created successfully! Refreshing...')
        setShowForm(false)
        setFormData({
          courseId: '',
          title: '',
          sub: '',
          level: 'beginner',
          category: 'hardware',
          description: '',
          duration: '',
          sessions: '',
          students: '',
          modules: '',
          price: '',
        })
        if (onCourseAdded) onCourseAdded(data.course)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating course')
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
        + Add New Course
      </button>

      {/* Form Modal */}
      {showForm && portalRoot && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0d] border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Create New Course</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Course ID *</label>
                  <input
                    type="text"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    placeholder="e.g., course-007"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Course Title"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Subtitle *</label>
                <input
                  type="text"
                  name="sub"
                  value={formData.sub}
                  onChange={handleInputChange}
                  placeholder="e.g., Embedded Systems"
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Level *</label>
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Price *</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="₹2,999"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Course description..."
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="8 Weeks"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Sessions *</label>
                  <input
                    type="text"
                    name="sessions"
                    value={formData.sessions}
                    onChange={handleInputChange}
                    placeholder="24 Sessions"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Students *</label>
                  <input
                    type="text"
                    name="students"
                    value={formData.students}
                    onChange={handleInputChange}
                    placeholder="2,400+"
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Course Modules (one per line) *</label>
                <textarea
                  name="modules"
                  value={formData.modules}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:border-white/40 outline-none font-mono text-xs"
                  rows="6"
                  placeholder="Module 1&#10;Module 2&#10;Module 3"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white rounded font-semibold hover:from-[#FF8A50] hover:to-[#FFA070] disabled:opacity-50 transition-all"
                >
                  {loading ? 'Creating...' : 'Create Course'}
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
