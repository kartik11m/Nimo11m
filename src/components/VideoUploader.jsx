import { useState } from 'react'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function VideoUploader({ sectionId, onUploadSuccess }) {
  const { isOwner } = useOwnerAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  if (!isOwner) return null

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      alert('Video file too large. Maximum 500MB allowed.')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('video', file)
    formData.append('sectionId', sectionId)

    try {
      const token = localStorage.getItem('ownerToken')
      console.log('Starting upload:', { sectionId, fileName: file.name, fileSize: file.size, token: !!token })
      
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percent)
        }
      })

      xhr.addEventListener('load', () => {
        console.log('Upload response:', { status: xhr.status, statusText: xhr.statusText })
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.success) {
              alert('Video uploaded successfully!')
              onUploadSuccess?.(response.video)
            } else {
              alert('Upload failed: ' + response.message)
            }
          } catch (parseError) {
            console.error('Response parse error:', parseError)
            alert('Upload failed: Invalid response from server')
          }
        } else {
          console.error('Upload failed with status:', xhr.status, xhr.responseText)
          alert('Upload failed: ' + xhr.statusText)
        }
        setIsUploading(false)
        setUploadProgress(0)
        e.target.value = ''
      })

      xhr.addEventListener('error', () => {
        console.error('Upload error event')
        alert('Upload error. Please try again.')
        setIsUploading(false)
        setUploadProgress(0)
      })

      xhr.addEventListener('abort', () => {
        console.error('Upload aborted')
        alert('Upload was cancelled.')
        setIsUploading(false)
        setUploadProgress(0)
      })

      xhr.open('POST', `${API_URL}/videos/upload`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      console.log('Sending upload request to:', `${API_URL}/videos/upload`)
      xhr.send(formData)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error.message)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="relative">
      <label
        className="inline-flex items-center gap-2 px-4 py-2 bg-orange/20 text-orange border border-orange/40 rounded-lg cursor-pointer hover:bg-orange/30 transition-colors text-sm font-medium"
        style={{
          backgroundColor: 'rgba(255,98,48,.15)',
          color: '#FF6230',
          borderColor: 'rgba(255,98,48,.4)'
        }}
      >
        <span>{isUploading ? `Uploading ${uploadProgress}%` : '📹 Replace Video'}</span>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
      </label>
      {isUploading && (
        <div className="mt-2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange transition-all"
            style={{
              width: `${uploadProgress}%`,
              backgroundColor: '#FF6230'
            }}
          />
        </div>
      )}
    </div>
  )
}
