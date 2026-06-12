const jwt = require('jsonwebtoken')

exports.protectOwner = (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.owner = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
