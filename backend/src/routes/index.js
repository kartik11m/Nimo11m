const express = require('express')
const router = express.Router()

// ── Route Groups ──────────────────────────────────────────────
// Example routes structure - add your actual routes here

// Admin routes (protected)
router.use('/admin', require('./admin'))

// Users routes
router.use('/users', require('./users'))

// Posts/Blog routes
router.use('/posts', require('./posts'))

// Contact form routes
router.use('/contact', require('./contact'))

module.exports = router
