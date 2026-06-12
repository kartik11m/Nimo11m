const express = require('express')
const router = express.Router()
const ownerController = require('../controllers/ownerController')
const contentController = require('../controllers/contentController')
const { protectOwner } = require('../middleware/ownerAuth')

// Owner routes - Login only (registration auto-creates on first run)
router.post('/owner/login', ownerController.login)
router.get('/owner/me', protectOwner, ownerController.getOwner)

// Content routes - Public read
router.get('/content', contentController.getAllContent)
router.get('/content/:page', contentController.getContentByPage)

// Content routes - Protected write (owner only)
router.put('/content/:key', protectOwner, contentController.updateContent)

module.exports = router
