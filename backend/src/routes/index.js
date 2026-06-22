const express = require('express')
const router = express.Router()

// ── Route Groups ──────────────────────────────────────────────
// Owner authentication and content management
router.use('/', require('./owner'))

// Photo management routes
router.use('/', require('./photos'))

// Video management routes
router.use('/', require('./videos'))

// Chapter management routes
router.use('/', require('./chapters'))

// Course management routes
router.use('/', require('./courses'))

// Event management routes
router.use('/', require('./events'))

// Card management routes (achievements, robots, stars, etc.)
router.use('/cards', require('./cards'))

// Contact form routes
router.use('/contact', require('./contact'))

module.exports = router
