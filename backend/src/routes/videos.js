const express = require('express')
const router = express.Router()
const videoController = require('../controllers/videoController')
const { protectOwner } = require('../middleware/ownerAuth')

// Public read routes
router.get('/videos', videoController.getAllVideos)
router.get('/videos/chapter/:chapter', videoController.getVideosByChapter)
router.get('/videos/page/:page', videoController.getVideosByPage)

// Protected write routes (owner only)
router.post('/videos', protectOwner, videoController.createVideo)
router.put('/videos/:videoId', protectOwner, videoController.updateVideo)
router.delete('/videos/:videoId', protectOwner, videoController.deleteVideo)

module.exports = router
