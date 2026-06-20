const express = require('express')
const router = express.Router()
const { protectOwner } = require('../middleware/ownerAuth')
const {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController')

// Public routes
router.get('/events', getAllEvents)
router.get('/events/upcoming', getUpcomingEvents)
router.get('/events/past', getPastEvents)
router.get('/events/:eventId', getEventById)

// Protected routes
router.post('/events', protectOwner, createEvent)
router.put('/events/:eventId', protectOwner, updateEvent)
router.delete('/events/:eventId', protectOwner, deleteEvent)

module.exports = router
