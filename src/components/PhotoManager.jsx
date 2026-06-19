import { useState, useCallback } from 'react'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const syne = { fontFamily: "'Syne', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }

export default function PhotoManager({ chapter, chapterColor, chapterRgb, onPhotosUpdate }) {
  const { token } = useOwnerAuth()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ caption: '', tag: '' })
  const [newPhoto, setNewPhoto] = useState({ caption: '', tag: '', file: null })
  const [message, setMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch photos for this chapter
  const fetchPhotos = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await fetch(`/api/photos/chapter/${chapter}`)
      const data = await res.json()
      if (data.success) setPhotos(data.photos)
    } catch (error) {
      console.error('Error fetching photos:', error)
      setMessage('Error loading photos')
    } finally {
      setLoading(false)
    }
  }, [token, chapter])

  // Load photos when component mounts or chapter changes
  useState(() => {
    fetchPhotos()
  }, [fetchPhotos])

  // Edit photo
  const handleEdit = (photo) => {
    setEditingId(photo._id || photo.photoId || photo.id)
    setFormData({ caption: photo.caption, tag: photo.tag })
  }

  // Save edited photo
  const handleSaveEdit = async (photoId) => {
    if (!formData.caption || !formData.tag) {
      setMessage('Caption and tag are required')
      return
    }

    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: formData.caption,
          tag: formData.tag,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMessage('Photo updated')
        setEditingId(null)
        fetchPhotos()
        onPhotosUpdate?.()
        setTimeout(() => setMessage(''), 2000)
      } else {
        setMessage(data.message || 'Error updating photo')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error updating photo')
    }
  }

  // Delete photo
  const handleDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return

    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()
      if (data.success) {
        setMessage('Photo deleted')
        fetchPhotos()
        onPhotosUpdate?.()
        setTimeout(() => setMessage(''), 2000)
      } else {
        setMessage(data.message || 'Error deleting photo')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error deleting photo')
    }
  }

  // Add new photo
  const handleAddPhoto = async () => {
    if (!newPhoto.caption || !newPhoto.tag || !newPhoto.file) {
      setMessage('Caption, tag, and image are required')
      return
    }

    // For now, we'll use the file name as the src
    // In production, you'd upload to a server/CDN
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        // Generate a unique photo ID
        const timestamp = Date.now()
        const photoId = `${chapter}-p-${timestamp}`

        const res = await fetch('/api/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            photoId,
            src: e.target.result, // Use base64 data URL
            caption: newPhoto.caption,
            tag: newPhoto.tag,
            chapter,
          }),
        })

        const data = await res.json()
        if (data.success) {
          setMessage('Photo added successfully!')
          setNewPhoto({ caption: '', tag: '', file: null })
          fetchPhotos()
          onPhotosUpdate?.()
          setTimeout(() => setMessage(''), 2000)
        } else {
          setMessage(data.message || 'Error adding photo')
        }
      } catch (error) {
        console.error('Error:', error)
        setMessage('Error adding photo')
      }
    }
    reader.readAsDataURL(newPhoto.file)
  }

  if (!token) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Collapsed button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-200"
        style={{
          background: isExpanded ? `rgba(${chapterRgb},.15)` : `rgba(${chapterRgb},.1)`,
          borderColor: chapterColor,
          color: chapterColor,
          boxShadow: `0 0 20px rgba(${chapterRgb},.25)`,
        }}
        title="Photo Manager"
      >
        📷
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div
          className="absolute bottom-20 right-0 w-96 max-h-[70vh] overflow-y-auto rounded-lg border shadow-2xl p-6"
          style={{
            background: '#050508',
            borderColor: `rgba(${chapterRgb},.3)`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: chapterColor, fontFamily: "'Syne', sans-serif" }}>
              📷 Photo Manager
            </h2>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-4 p-3 rounded border text-sm"
              style={{ borderColor: chapterColor, color: chapterColor, background: `rgba(${chapterRgb},.1)` }}
            >
              {message}
            </div>
          )}

          {/* Add Photo Section */}
          <div className="mb-6 p-4 border rounded" style={{ borderColor: `rgba(${chapterRgb},.2)` }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: chapterColor }}>Add New Photo</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Caption"
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                className="w-full bg-[#0a0a0d] border rounded px-3 py-2 text-sm text-white"
                style={{ borderColor: `rgba(${chapterRgb},.2)` }}
              />
              <input
                type="text"
                placeholder="Tag"
                value={newPhoto.tag}
                onChange={(e) => setNewPhoto({ ...newPhoto, tag: e.target.value })}
                className="w-full bg-[#0a0a0d] border rounded px-3 py-2 text-sm text-white"
                style={{ borderColor: `rgba(${chapterRgb},.2)` }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPhoto({ ...newPhoto, file: e.target.files?.[0] })}
                className="w-full text-xs text-white/50"
              />
              <button
                onClick={handleAddPhoto}
                disabled={!newPhoto.caption || !newPhoto.tag || !newPhoto.file}
                className="w-full py-2 rounded text-sm font-bold transition-all"
                style={{
                  background: `rgba(${chapterRgb},.15)`,
                  color: chapterColor,
                  borderColor: chapterColor,
                  border: `1px solid ${chapterColor}`,
                  opacity: !newPhoto.caption || !newPhoto.tag || !newPhoto.file ? 0.5 : 1,
                  cursor: !newPhoto.caption || !newPhoto.tag || !newPhoto.file ? 'not-allowed' : 'pointer',
                }}
              >
                Add Photo
              </button>
            </div>
          </div>

          {/* Photos List */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: chapterColor }}>
              Photos ({photos.length})
            </h3>

            {loading ? (
              <p className="text-xs text-white/40">Loading...</p>
            ) : photos.length === 0 ? (
              <p className="text-xs text-white/40">No photos yet</p>
            ) : (
              <div className="space-y-3">
                {photos.map((photo) => (
                  <div
                    key={photo._id}
                    className="p-3 rounded border"
                    style={{ borderColor: `rgba(${chapterRgb},.2)` }}
                  >
                    {editingId === photo._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={formData.caption}
                          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                          className="w-full bg-[#0a0a0d] border rounded px-2 py-1 text-xs text-white"
                          style={{ borderColor: `rgba(${chapterRgb},.2)` }}
                        />
                        <input
                          type="text"
                          value={formData.tag}
                          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                          className="w-full bg-[#0a0a0d] border rounded px-2 py-1 text-xs text-white"
                          style={{ borderColor: `rgba(${chapterRgb},.2)` }}
                        />
                        <div className="flex gap-2 text-xs">
                          <button
                            onClick={() => handleSaveEdit(photo._id || photo.photoId || photo.id)}
                            className="flex-1 py-1 rounded"
                            style={{
                              background: chapterColor,
                              color: '#050508',
                              fontWeight: 'bold',
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-1 rounded border"
                            style={{
                              borderColor: `rgba(${chapterRgb},.3)`,
                              color: chapterColor,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <p className="text-xs font-bold text-white/80">{photo.caption}</p>
                        <p className="text-xs text-white/50 mb-2">{photo.tag}</p>
                        <div className="flex gap-2 text-xs">
                          <button
                            onClick={() => handleEdit(photo)}
                            className="flex-1 py-1 rounded"
                            style={{
                              background: `rgba(${chapterRgb},.15)`,
                              color: chapterColor,
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(photo._id || photo.photoId)}
                            className="flex-1 py-1 rounded border"
                            style={{
                              borderColor: `rgba(255,0,0,.3)`,
                              color: '#ff6b6b',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
