const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const multer = require('multer')
const videoController = require('../controllers/videoController')
const { protectOwner } = require('../middleware/ownerAuth')

const uploadDir = path.join(__dirname, '../../public/uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4'
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only allow video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only video files are allowed'), false)
    }
  },
})

// Public read routes
router.get('/videos', videoController.getAllVideos)
router.get('/videos/chapter/:chapter', videoController.getVideosByChapter)
router.get('/videos/page/:page', videoController.getVideosByPage)

// Protected write routes (owner only)
router.post('/videos', protectOwner, videoController.createVideo)
router.post('/videos/upload', protectOwner, upload.single('video'), videoController.uploadVideo)
router.put('/videos/:videoId', protectOwner, videoController.updateVideo)
router.delete('/videos/:videoId', protectOwner, videoController.deleteVideo)

module.exports = router
