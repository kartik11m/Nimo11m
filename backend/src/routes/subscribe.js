const express = require('express')
const router = express.Router()
const { sendSubscriptionNotification, sendSubscriptionConfirmationEmail } = require('../utils/sendMail')

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

router.post('/', async (req, res) => {
  const email = cleanText(req.body?.email || req.body?.emailAddress || '')

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    })
  }

  try {
    await sendSubscriptionNotification({
      to: process.env.OWNER_EMAIL || process.env.SMTP_USER || 'hello@nimolabs.in',
      email,
    })

    await sendSubscriptionConfirmationEmail({
      to: email,
      email,
    })

    return res.status(200).json({
      success: true,
      message: 'You are subscribed! Please check your inbox for a confirmation message.',
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({
      success: false,
      message: 'We could not subscribe you right now. Please try again later.',
    })
  }
})

module.exports = router
