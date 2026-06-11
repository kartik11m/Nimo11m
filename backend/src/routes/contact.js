const express = require('express')
const router = express.Router()

// ── SUBMIT contact form ───────────────────────────────────────
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    })
  }

  // TODO: Save to database and send email notification
  res.status(201).json({
    success: true,
    message: 'Your message has been received. We will get back to you soon!'
  })
})

module.exports = router
