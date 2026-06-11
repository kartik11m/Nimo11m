const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    excerpt: String,
    image: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    readTime: Number,
    tags: [String],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Post', postSchema)
