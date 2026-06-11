const mongoose = require('mongoose')

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'LOGIN', 'LOGOUT'],
      required: true,
    },
    resourceType: {
      type: String,
      enum: ['POST', 'USER', 'CONTENT'],
      required: true,
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    resourceName: String,
    details: mongoose.Schema.Types.Mixed, // Store any additional details
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('AdminActivity', adminActivitySchema)
