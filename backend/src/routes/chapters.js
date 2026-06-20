const express = require('express')
const router = express.Router()
const chapterController = require('../controllers/chapterController')
const { protectOwner } = require('../middleware/ownerAuth')

// Public read routes
router.get('/chapters', chapterController.getAllChapters)
router.get('/chapters/:chapterId', chapterController.getChapterById)

// Protected write routes (owner only)
router.post('/chapters', protectOwner, chapterController.createChapter)
router.put('/chapters/:chapterId', protectOwner, chapterController.updateChapter)
router.delete('/chapters/:chapterId', protectOwner, chapterController.deleteChapter)
router.delete('/chapters/:chapterId/force', protectOwner, chapterController.deleteChapterAndVideos)

module.exports = router
