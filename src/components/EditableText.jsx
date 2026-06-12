import { useState, useEffect, useRef } from 'react'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const dmSans = { fontFamily: "'DM Sans', sans-serif" }
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function EditableText({ contentId, children, className = '', accent = '#FF6B35' }) {
  const { isOwner, updateContent } = useOwnerAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayText, setDisplayText] = useState(children)
  const [editValue, setEditValue] = useState(children)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef(null)

  // Fetch content from database on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/content`)
        const data = await res.json()
        if (data.success) {
          const found = data.content.find(c => c.key === contentId)
          if (found) {
            setDisplayText(found.content)
            setEditValue(found.content)
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error)
      }
    }
    fetchContent()
  }, [contentId])

  const handleSave = async () => {
    if (editValue === displayText) {
      setIsEditing(false)
      return
    }

    setSaving(true)
    try {
      await updateContent(contentId, editValue)
      setDisplayText(editValue)
      setIsEditing(false)
    } catch (error) {
      alert('Failed to save: ' + error.message)
      setEditValue(displayText) // Revert on error
    } finally {
      setSaving(false)
    }
  }

  // Auto-resize textarea to fit content
  const handleTextChange = (e) => {
    setEditValue(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + 'px'
    }
  }

  // Adjust height when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + 'px'
      }, 0)
    }
  }, [isEditing])

  if (isOwner && isEditing) {
    return (
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={handleTextChange}
          className="w-full px-3 py-2 rounded text-white focus:outline-none resize-none"
          style={{
            ...dmSans,
            backgroundColor: `${accent}20`,
            borderColor: accent,
            borderWidth: '1px',
            minHeight: '60px',
            maxHeight: '300px',
            overflow: 'auto',
          }}
          autoFocus
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1 rounded text-white text-sm font-bold disabled:opacity-50 hover:opacity-90"
            style={{
              backgroundColor: accent,
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => {
              setEditValue(displayText)
              setIsEditing(false)
            }}
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <span
      onClick={() => isOwner && setIsEditing(true)}
      className={`${isOwner ? 'cursor-pointer hover:bg-white/5 px-1 rounded transition-colors' : ''} ${className}`}
    >
      {displayText}
    </span>
  )
}
