// ── Custom Error Class ───────────────────────────────────────
class AppError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// ── Error Handler Middleware ─────────────────────────────────
const errorHandler = (err, req, res, next) => {
  err.status = err.status || 500
  err.message = err.message || 'Internal Server Error'

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found: ${err.path}`
    err = new AppError(message, 400)
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)
    const message = `${field} already exists`
    err = new AppError(message, 400)
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    err = new AppError(message, 401)
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    err = new AppError(message, 401)
  }

  res.status(err.status).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = { AppError, errorHandler }
