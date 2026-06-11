const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')

// Import admin controllers (we'll create these next)
const adminAuthController = require('../controllers/adminAuthController')
const adminContentController = require('../controllers/adminContentController')

// ── ADMIN AUTH ROUTES ─────────────────────────────────────────
router.post('/auth/register', adminAuthController.register)
router.post('/auth/login', adminAuthController.login)
router.post('/auth/logout', protect, adminAuthController.logout)
router.get('/auth/me', protect, adminAuthController.getMe)

// ── PROTECTED ADMIN ROUTES (require authentication & admin role) ─
// Content Management
router.post('/content/posts', protect, authorize('admin'), adminContentController.createPost)
router.put('/content/posts/:id', protect, authorize('admin'), adminContentController.updatePost)
router.delete('/content/posts/:id', protect, authorize('admin'), adminContentController.deletePost)
router.get('/content/posts', protect, authorize('admin'), adminContentController.getAllPosts)

// Users Management
router.get('/users', protect, authorize('admin'), adminAuthController.getAllUsers)
router.put('/users/:id', protect, authorize('admin'), adminAuthController.updateUser)
router.delete('/users/:id', protect, authorize('admin'), adminAuthController.deleteUser)
router.put('/users/:id/role', protect, authorize('admin'), adminAuthController.updateUserRole)

module.exports = router
