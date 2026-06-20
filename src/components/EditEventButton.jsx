import { useState } from 'react'
import { createPortal } from 'react-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function EditEventButton({ event, onEventUpdated, onEventDeleted }) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(event || {})
  const [portalRoot] = useState(() => {
    const el = document.createElement('div')
    el.id = `edit-event-${event.eventId}-portal`
    document.body.appendChild(el)
    return el
  })

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }))
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('ownerToken')
      
      const tags = formData.tags && typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t)
        : formData.tags || []
      
      const body = {
        ...formData,
        seats: formData.seats ? parseInt(formData.seats) : 0,
        filled: formData.filled ? parseInt(formData.filled) : 0,
        attendees: formData.attendees ? parseInt(formData.attendees) : 0,
        tags,
      }

      const res = await fetch(`${API_URL}/events/${event.eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        setShowEdit(false)
        if (onEventUpdated) onEventUpdated(data.event)
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('ownerToken')
      const res = await fetch(`${API_URL}/events/${event.eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()
      if (data.success) {
        setShowDelete(false)
        if (onEventDeleted) onEventDeleted(event.eventId)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Edit/Delete Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowEdit(true)}
          className="bg-[#FF6B35]/80 hover:bg-[#FF6B35] text-white px-2 py-1 text-sm rounded transition-all"
          title="Edit event"
        >
          ✎
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="bg-red-500/80 hover:bg-red-600 text-white px-2 py-1 text-sm rounded transition-all"
          title="Delete event"
        >
          🗑
        </button>
      </div>

      {/* Edit Modal */}
      {showEdit && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#020203] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Edit Event</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Event ID</label>
                  <input type="text" value={event.eventId} disabled className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white/40" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white">
                    <option value="Workshop">Workshop</option>
                    <option value="Summer Camp">Summer Camp</option>
                    <option value="School Visit">School Visit</option>
                    <option value="Competition">Competition</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white">
                    <option value="Open">Open</option>
                    <option value="Filling Fast">Filling Fast</option>
                    <option value="Booking Open">Booking Open</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-white flex-1">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="rounded" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-white flex-1">
                    <input type="checkbox" name="isPast" checked={formData.isPast} onChange={handleChange} className="rounded" />
                    Past Event
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Subtitle</label>
                <input type="text" name="sub" value={formData.sub} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Description</label>
                <textarea name="desc" value={formData.desc} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" rows="3" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Day</label>
                  <input type="text" name="day" value={formData.day} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Month</label>
                  <input type="text" name="month" value={formData.month} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Year</label>
                  <input type="text" name="year" value={formData.year} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Full Date</label>
                  <input type="text" name="monthFull" value={formData.monthFull} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Time</label>
                  <input type="text" name="time" value={formData.time} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Duration</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Venue</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Seats</label>
                  <input type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Filled</label>
                  <input type="number" name="filled" value={formData.filled} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Attendees</label>
                  <input type="number" name="attendees" value={formData.attendees} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Target Date</label>
                  <input type="datetime-local" name="target" value={formData.target} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Price</label>
                  <input type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Tags (comma-separated)</label>
                <input type="text" name="tags" value={typeof formData.tags === 'string' ? formData.tags : formData.tags?.join(', ') || ''} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Event Number</label>
                  <input type="text" name="num" value={formData.num} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Highlight</label>
                  <input type="text" name="highlight" value={formData.highlight} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleUpdate} disabled={loading} className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded font-semibold disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setShowEdit(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        portalRoot
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#020203] border border-red-500/30 rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Delete Event</h2>
            <p className="text-white/60 mb-6">Are you sure you want to delete <span className="text-white font-semibold">"{event.title}"</span>? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={loading} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold disabled:opacity-50">
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={() => setShowDelete(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10">
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
