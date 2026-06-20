const express = require('express')
const router = express.Router()
const multer = require('multer')
const videoController = require('../controllers/videoController')
const { protectOwner } = require('../middleware/ownerAuth')

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
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
