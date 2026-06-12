const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      description: 'Unique identifier for content section (e.g., "home.hero.title")',
    },
    label: {
      type: String,
      required: true,
      description: 'Human-readable label for the content',
    },
    type: {
      type: String,
      enum: ['text', 'paragraph', 'heading', 'richtext'],
      default: 'text',
    },
    content: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      description: 'Which page this content is on (e.g., "home", "about", "training")',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Content', contentSchema)
