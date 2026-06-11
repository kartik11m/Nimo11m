// ── Log Admin Activity ────────────────────────────────────────
const AdminActivity = require('../models/AdminActivity')

const logActivity = async (req, res, next) => {
  // Skip logging for auth routes
  if (req.path.includes('/admin/auth/')) {
    return next()
  }

  // Capture original send function
  const originalSend = res.send

  res.send = async function (data) {
    // Log activity if user is authenticated
    if (req.user) {
      try {
        const activity = new AdminActivity({
          admin: req.user.id,
          action: req.method,
          resourceType: 'CONTENT',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        })
        await activity.save()
      } catch (error) {
        console.error('Failed to log activity:', error)
      }
    }

    // Call original send
    res.send = originalSend
    return res.send(data)
  }

  next()
}

module.exports = logActivity
