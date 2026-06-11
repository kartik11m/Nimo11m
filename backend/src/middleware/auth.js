const jwt = require('jsonwebtoken')
const { AppError } = require('./errorHandler')

// ── Protect Routes (verify JWT) ───────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      return next(new AppError('Not authorized to access this route', 401))
    }
  } catch (error) {
    next(error)
  }
}

// ── Authorize specific roles ──────────────────────────────────
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError(`User role '${req.user?.role}' is not authorized to access this route`, 403))
    }
    next()
  }
}

module.exports = { protect, authorize }
