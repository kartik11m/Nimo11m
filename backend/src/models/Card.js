const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema(
  {
    cardType: {
      type: String,
      enum: ['achievement', 'robot', 'star', 'testimonial', 'skill', 'cert', 'photo'],
      required: true,
      description: 'Type of card (achievement, robot, star, testimonial, skill, cert, photo)',
    },
    page: {
      type: String,
      required: true,
      default: 'achievements',
      description: 'Which page this card belongs to',
    },
    index: {
      type: Number,
      required: true,
      description: 'Position in the array (for ordering)',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      description: 'Card data (flexible schema based on card type)',
    },
    active: {
      type: Boolean,
      default: true,
      description: 'Whether this card should be displayed',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Card', cardSchema)
