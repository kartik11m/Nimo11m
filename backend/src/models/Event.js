const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Workshop', 'Summer Camp', 'School Visit', 'Competition'], required: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Open', 'Filling Fast', 'Booking Open', 'Coming Soon'], required: true },
  isPast: { type: Boolean, default: false },
  
  // Event details
  title: { type: String, required: true },
  sub: { type: String, required: true },
  desc: { type: String, required: true },
  
  // Date/time
  day: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
  monthFull: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  
  // Venue and seats
  venue: { type: String, required: true },
  seats: { type: Number, required: true },
  filled: { type: Number, default: 0 },
  
  // Countdown target (for upcoming events)
  target: { type: Date, default: null },
  
  // Tags and info
  tags: [String],
  price: { type: String, required: true },
  num: { type: String, required: true },
  
  // Past event specific
  attendees: { type: Number, default: 0 },
  highlight: { type: String, default: '' },
  
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Event', eventSchema)
