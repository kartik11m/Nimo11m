const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
  chapterId: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
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
  isActive: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model('Chapter', chapterSchema)
