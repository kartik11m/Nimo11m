const express = require('express')
const router = express.Router()

// ── Route Groups ──────────────────────────────────────────────
// Owner authentication and content management
router.use('/', require('./owner'))

// Contact form routes
router.use('/contact', require('./contact'))

module.exports = router
