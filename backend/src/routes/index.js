const express = require('express')
const router = express.Router()

// ── Route Groups ──────────────────────────────────────────────
// Owner authentication and content management
router.use('/', require('./owner'))

// Photo management routes
router.use('/', require('./photos'))

// Video management routes
router.use('/', require('./videos'))

// Contact form routes
router.use('/contact', require('./contact'))

module.exports = router
