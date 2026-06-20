const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  src: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '0:00',
  },
  color: {
    type: String,
    default: '#FF6B35',
  },
  rgb: {
    type: String,
    default: '255,107,53',
  },
  order: {
    type: Number,
    default: 0,
  },
  page: {
    type: String,
    default: 'robots',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Video', videoSchema)
