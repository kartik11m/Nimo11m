const fs = require('fs')
const path = require('path')
const Video = require('../models/Video')

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ chapter: 1, order: 1 })
    res.json({ success: true, videos })
  } catch (error) {
    console.error('Error getting videos:', error)
    res.status(500).json({ success: false, message: 'Error fetching videos' })
  }
}

// Get videos by chapter
exports.getVideosByChapter = async (req, res) => {
  try {
    const { chapter } = req.params
    const videos = await Video.find({ chapter }).sort({ order: 1 })
    res.json({ success: true, videos })
  } catch (error) {
    console.error('Error getting videos by chapter:', error)
    res.status(500).json({ success: false, message: 'Error fetching videos' })
  }
}

// Get videos by page
exports.getVideosByPage = async (req, res) => {
  try {
    const { page } = req.params
    const videos = await Video.find({ page }).sort({ chapter: 1, order: 1 })
    res.json({ success: true, videos })
  } catch (error) {
    console.error('Error getting videos by page:', error)
    res.status(500).json({ success: false, message: 'Error fetching videos' })
  }
}

// Create video
exports.createVideo = async (req, res) => {
  try {
    const { videoId, src, title, tag, chapter, duration, color, rgb } = req.body

    // Validate required fields
    if (!src || !title || !tag || !chapter) {
      return res.status(400).json({
        success: false,
        message: 'src, title, tag, and chapter are required',
      })
    }

    // Check if videoId already exists
    if (videoId) {
      const existing = await Video.findOne({ videoId })
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Video with this ID already exists',
        })
      }
    }

    const video = new Video({
      videoId,
      src,
      title,
      tag,
      chapter,
      duration: duration || '0:00',
      color: color || '#FF6B35',
      rgb: rgb || '255,107,53',
      order: await Video.countDocuments({ chapter }),
    })

    await video.save()
    res.status(201).json({ success: true, video })
  } catch (error) {
    console.error('Error creating video:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Request body:', req.body)
    res.status(500).json({ success: false, message: 'Error creating video', error: error.message })
  }
}

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params
    const { src, title, tag, duration, color, rgb, order } = req.body

    // Try to find by videoId first, then by MongoDB _id
    let video = await Video.findOne({ videoId })
    if (!video) {
      video = await Video.findByIdAndUpdate(videoId, req.body, { new: true })
    } else {
      if (src !== undefined) video.src = src
      if (title !== undefined) video.title = title
      if (tag !== undefined) video.tag = tag
      if (duration !== undefined) video.duration = duration
      if (color !== undefined) video.color = color
      if (rgb !== undefined) video.rgb = rgb
      if (order !== undefined) video.order = order
      video.updatedAt = new Date()
      await video.save()
    }

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' })
    }

    res.json({ success: true, video })
  } catch (error) {
    console.error('Error updating video:', error)
    res.status(500).json({ success: false, message: 'Error updating video' })
  }
}

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params

    // Try to find and delete by videoId first, then by MongoDB _id
    let video = await Video.findOneAndDelete({ videoId })
    if (!video) {
      video = await Video.findByIdAndDelete(videoId)
    }

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' })
    }

    res.json({ success: true, message: 'Video deleted', video })
  } catch (error) {
    console.error('Error deleting video:', error)
    res.status(500).json({ success: false, message: 'Error deleting video' })
  }
}

// Upload video (multipart form-data)
exports.uploadVideo = async (req, res) => {
  try {
    console.log('uploadVideo called')
    console.log('req.body:', req.body)
    console.log('req.file:', req.file ? { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size } : 'No file')
    
    const { sectionId } = req.body
    const file = req.file

    if (!file) {
      console.error('No file provided')
      return res.status(400).json({
        success: false,
        message: 'No video file provided',
      })
    }

    if (!sectionId) {
      console.error('No sectionId provided')
      return res.status(400).json({
        success: false,
        message: 'sectionId is required',
      })
    }

    const uploadDir = path.join(__dirname, '../../public/uploads')
    const ext = path.extname(file.originalname) || '.mp4'
    const storedFileName = `${sectionId}-${Date.now()}${ext}`
    const storedPath = path.join(uploadDir, storedFileName)

    if (file.path && fs.existsSync(file.path)) {
      fs.renameSync(file.path, storedPath)
    } else {
      fs.writeFileSync(storedPath, fs.readFileSync(file.path || storedPath))
    }

    const publicUrl = `/uploads/${storedFileName}`

    // Generate unique videoId
    const videoId = `${sectionId}-${Date.now()}`

    // Try to find existing video for this section and update it
    let video = await Video.findOne({ page: sectionId })

    if (video) {
      console.log('Updating existing video:', videoId)
      video.src = publicUrl
      video.updatedAt = new Date()
      await video.save()
    } else {
      console.log('Creating new video:', videoId)
      video = new Video({
        videoId,
        src: publicUrl,
        title: `${sectionId} Video`,
        tag: 'Section',
        chapter: 'ch1',
        page: sectionId,
        duration: '0:00',
        color: '#FF6B35',
        rgb: '255,107,53',
        order: 0,
      })
      await video.save()
    }

    console.log('Video saved successfully:', { videoId, page: sectionId, src: publicUrl })
    res.status(201).json({ success: true, video, src: publicUrl })
  } catch (error) {
    console.error('Error uploading video:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Request body:', req.body)
    res.status(500).json({ success: false, message: 'Error uploading video', error: error.message })
  }
}
