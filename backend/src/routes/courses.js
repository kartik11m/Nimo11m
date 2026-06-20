const express = require('express')
const router = express.Router()
const { protectOwner } = require('../middleware/ownerAuth')
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController')

// Public routes
router.get('/courses', getAllCourses)
router.get('/courses/:courseId', getCourseById)

// Protected routes
router.post('/courses', protectOwner, createCourse)
router.put('/courses/:courseId', protectOwner, updateCourse)
router.delete('/courses/:courseId', protectOwner, deleteCourse)

module.exports = router
