const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema(
  {
    photoId: {
      type: String,
      required: true,
      unique: true,
      description: 'Unique identifier for the photo (e.g., "ch1-p1", "nimo-p1")',
    },
    src: {
      type: String,
      required: true,
      description: 'URL/path to the photo image',
    },
    caption: {
      type: String,
      required: true,
      description: 'Caption text shown on hover in gallery',
    },
    tag: {
      type: String,
      required: true,
      description: 'Tag/category for the photo',
    },
    chapter: {
      type: String,
      required: true,
      description: 'Which chapter this photo belongs to (e.g., "chapter1", "chapter2", "nimo")',
    },
    order: {
      type: Number,
      default: 0,
      description: 'Display order within the chapter',
    },
    page: {
      type: String,
      default: 'robots',
      description: 'Which page this photo is on',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Photo', photoSchema)
