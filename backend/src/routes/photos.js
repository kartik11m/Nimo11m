const express = require('express')
const router = express.Router()
const photoController = require('../controllers/photoController')
const { protectOwner } = require('../middleware/ownerAuth')

// Public read routes
router.get('/photos', photoController.getAllPhotos)
router.get('/photos/chapter/:chapter', photoController.getPhotosByChapter)
router.get('/photos/page/:page', photoController.getPhotosByPage)

// Protected write routes (owner only)
router.post('/photos', protectOwner, photoController.createPhoto)
router.put('/photos/:photoId', protectOwner, photoController.updatePhoto)
router.delete('/photos/:photoId', protectOwner, photoController.deletePhoto)

module.exports = router
