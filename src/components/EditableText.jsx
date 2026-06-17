import { useState, useEffect, useRef } from 'react'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const dmSans = { fontFamily: "'DM Sans', sans-serif" }
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function EditableText({ contentId, children, className = '', accent = '#FF6B35', textColor = 'rgba(255,255,255,.45)', hasGradient = false }) {
  const { isOwner, updateContent } = useOwnerAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayText, setDisplayText] = useState(children)
  const [editValue, setEditValue] = useState(children)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef(null)

  // Get background color matching text color with reduced opacity
  const getEditBoxBackground = () => {
    if (textColor.startsWith('#')) {
      return `${textColor}15` // Hex with 15% opacity
    } else if (textColor.includes('rgba')) {
      // For rgba colors, reduce opacity to 0.1
      return textColor.replace(/rgba\(([^,]+),\s*([^,]+),\s*([^,]+),\s*[\d.]+\)/, 'rgba($1, $2, $3, 0.1)')
    }
    return `${textColor}15`
  }

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
      <div className="relative w-full" style={{ 
        display: 'block', 
        WebkitTextFillColor: 'unset',
        backgroundClip: 'unset',
        WebkitBackgroundClip: 'unset',
        filter: 'none'
      }}>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={handleTextChange}
          className="w-full px-3 py-2 rounded focus:outline-none resize-none"
          style={{
            ...dmSans,
            color: textColor,
            backgroundColor: getEditBoxBackground(),
            borderColor: textColor,
            borderWidth: '1px',
            minHeight: '60px',
            maxHeight: '300px',
            overflow: 'auto',
            display: 'block',
            WebkitTextFillColor: 'unset',
            backgroundClip: 'unset',
            WebkitBackgroundClip: 'unset',
            filter: 'none'
          }}
          autoFocus
        />
        <div className="flex gap-3 mt-4 flex-wrap" style={{ position: 'relative', zIndex: 50, gap: '12px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              backgroundColor: textColor,
              border: `2px solid ${textColor}`,
              boxShadow: `0 0 12px ${textColor.startsWith('#') ? textColor + '40' : textColor.replace(/[\d.]+\)/, '0.25)')}`,
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: saving ? 0.6 : 1,
              display: 'inline-block',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => !saving && (e.target.style.filter = 'brightness(1.2)')}
            onMouseLeave={(e) => (e.target.style.filter = 'brightness(1)')}
          >
            {saving ? 'Saving...' : '✓ Save'}
          </button>
          <button
            onClick={() => {
              setEditValue(displayText)
              setIsEditing(false)
            }}
            style={{
              backgroundColor: 'rgba(255,255,255,.08)',
              border: '2px solid rgba(255,255,255,.25)',
              boxShadow: '0 0 12px rgba(255,255,255,.08)',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'inline-block',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,.12)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,.08)')}
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <span
      onClick={() => isOwner && setIsEditing(true)}
      className={`${isOwner ? 'cursor-pointer hover:bg-white/5 px-1 rounded transition-colors' : ''} ${className}`}
      style={{ display: 'inline' }}
    >
      {hasGradient ? (
        <span
          style={{
            background: `linear-gradient(90deg,#FF6230,#E0357A)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
            backgroundClip:       "text",
            display: 'inline-block'
          }}
        >
          {displayText}
        </span>
      ) : (
        displayText
      )}
    </span>
  )
}
