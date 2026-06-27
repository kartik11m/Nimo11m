const jwt = require('jsonwebtoken')

function getJwtSecrets() {
  return [process.env.JWT_SECRET, process.env.JWT_SECRET_KEY, 'your-secret-key'].filter(Boolean)
}

function signOwnerToken(payload) {
  const secret = getJwtSecrets()[0]
  if (!secret) {
    throw new Error('JWT secret is not configured')
  }

  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

function verifyOwnerToken(token) {
  const secrets = getJwtSecrets()
  let lastError = null

  for (const secret of secrets) {
    try {
      return jwt.verify(token, secret)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Invalid token')
}

module.exports = { getJwtSecrets, signOwnerToken, verifyOwnerToken }
