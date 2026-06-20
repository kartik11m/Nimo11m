import { useState } from 'react'
import { createPortal } from 'react-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AddEventButton({ onEventAdded }) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    eventId: '',
    type: 'Workshop',
    featured: false,
    status: 'Open',
    isPast: false,
    title: '',
    sub: '',
    desc: '',
    day: '',
    month: '',
    year: '',
    monthFull: '',
    time: '',
    duration: '',
    venue: '',
    seats: '',
    filled: '',
    target: '',
    tags: '',
    price: '',
    num: '',
    attendees: '',
    highlight: '',
  })
  const [portalRoot] = useState(() => {
    const el = document.createElement('div')
    el.id = 'add-event-portal-root'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('ownerToken')
      
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      const body = {
        ...formData,
        seats: formData.seats ? parseInt(formData.seats) : 0,
        filled: formData.filled ? parseInt(formData.filled) : 0,
        attendees: formData.attendees ? parseInt(formData.attendees) : 0,
        tags,
      }

      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        setShowForm(false)
        setFormData({
          eventId: '', type: 'Workshop', featured: false, status: 'Open', isPast: false,
          title: '', sub: '', desc: '', day: '', month: '', year: '', monthFull: '',
          time: '', duration: '', venue: '', seats: '', filled: '', target: '',
          tags: '', price: '', num: '', attendees: '', highlight: '',
        })
        if (onEventAdded) onEventAdded()
        // Refresh page after creation
        setTimeout(() => window.location.reload(), 500)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="font-condensed font-normal text-[10px] tracking-[.35em] uppercase px-6 py-3 bg-[#A855F7] hover:bg-[#A855F7]/90 text-white border-none cursor-pointer transition-all duration-300 flex items-center gap-2"
      >
        <span>+ Add New Event</span>
      </button>

      {showForm && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#020203] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Create New Event</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="eventId" placeholder="Event ID" value={formData.eventId} onChange={handleChange} required className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <select name="type" value={formData.type} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white">
                  <option value="Workshop">Workshop</option>
                  <option value="Summer Camp">Summer Camp</option>
                  <option value="School Visit">School Visit</option>
                  <option value="Competition">Competition</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select name="status" value={formData.status} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white">
                  <option value="Open">Open</option>
                  <option value="Filling Fast">Filling Fast</option>
                  <option value="Booking Open">Booking Open</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
                <label className="flex items-center gap-2 text-white">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="rounded" />
                  Featured
                </label>
              </div>

              <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              <input type="text" name="sub" placeholder="Subtitle" value={formData.sub} onChange={handleChange} required className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              <textarea name="desc" placeholder="Description" value={formData.desc} onChange={handleChange} required className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" rows="3" />

              <div className="grid grid-cols-4 gap-2">
                <input type="text" name="day" placeholder="Day" value={formData.day} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <input type="text" name="month" placeholder="Month" value={formData.month} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <input type="text" name="monthFull" placeholder="Full Month" value={formData.monthFull} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="time" placeholder="Time" value={formData.time} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <input type="text" name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              </div>

              <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />

              <div className="grid grid-cols-3 gap-2">
                <input type="number" name="seats" placeholder="Seats" value={formData.seats} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <input type="number" name="filled" placeholder="Filled" value={formData.filled} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <input type="number" name="attendees" placeholder="Attendees" value={formData.attendees} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="datetime-local" name="target" value={formData.target} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
                <input type="text" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              </div>

              <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              <input type="text" name="num" placeholder="Event Number" value={formData.num} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />
              <input type="text" name="highlight" placeholder="Highlight (for past events)" value={formData.highlight} onChange={handleChange} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/40" />

              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" name="isPast" checked={formData.isPast} onChange={handleChange} className="rounded" />
                Mark as Past Event
              </label>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded font-semibold disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10">
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
