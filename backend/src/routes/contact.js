const express = require('express')
const router = express.Router()
const { sendEnquiryEmail, sendThankYouEmail } = require('../utils/sendMail')

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function formatPayload(body) {
  const type = cleanText(body.type || body.formType || body.kind || body.source || 'General enquiry')
  const name = cleanText(body.name || body.contactName || body.fullName || body.full_name || 'N/A')
  const email = cleanText(body.email || body.contactEmail || body.emailAddress || '')
  const phone = cleanText(body.phone || body.contactPhone || body.mobile || '')
  const service = cleanText(body.service || body.preferredProgram || body.institutionType || body.subject || '')
  const school = cleanText(body.school || body.organization || body.institutionName || '')
  const students = cleanText(body.students || body.studentCount || '')
  const message = cleanText(body.message || body.notes || body.details || '')
  const institutionName = cleanText(body.institutionName || '')
  const institutionType = cleanText(body.institutionType || '')
  const city = cleanText(body.city || '')
  const designation = cleanText(body.designation || '')
  const selectedLabs = cleanText(Array.isArray(body.selectedLabs) ? body.selectedLabs.join(', ') : body.selectedLabs || '')
  const area = cleanText(body.area || '')
  const budget = cleanText(body.budget || '')
  const timeline = cleanText(body.timeline || '')
  const notes = cleanText(body.notes || '')

  const subject = `New ${type} from ${name}`

  const detailLines = [
    `Type: ${type}`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    service ? `Service / Program: ${service}` : null,
    school ? `School / Organization: ${school}` : null,
    students ? `Students: ${students}` : null,
    institutionName ? `Institution Name: ${institutionName}` : null,
    institutionType ? `Institution Type: ${institutionType}` : null,
    city ? `City: ${city}` : null,
    designation ? `Designation: ${designation}` : null,
    selectedLabs ? `Labs: ${selectedLabs}` : null,
    area ? `Area: ${area}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    notes ? `Notes: ${notes}` : null,
    '',
    `Message: ${message || 'No message provided'}`,
  ].filter(Boolean)

  const textLines = [
    'New enquiry submitted through Robolearn',
    '',
    ...detailLines,
  ]

  const detailHtml = [
    `<p><strong>Type:</strong> ${type}</p>`,
    `<p><strong>Name:</strong> ${name}</p>`,
    `<p><strong>Email:</strong> ${email}</p>`,
    phone ? `<p><strong>Phone:</strong> ${phone}</p>` : '',
    service ? `<p><strong>Service / Program:</strong> ${service}</p>` : '',
    school ? `<p><strong>School / Organization:</strong> ${school}</p>` : '',
    students ? `<p><strong>Students:</strong> ${students}</p>` : '',
    institutionName ? `<p><strong>Institution Name:</strong> ${institutionName}</p>` : '',
    institutionType ? `<p><strong>Institution Type:</strong> ${institutionType}</p>` : '',
    city ? `<p><strong>City:</strong> ${city}</p>` : '',
    designation ? `<p><strong>Designation:</strong> ${designation}</p>` : '',
    selectedLabs ? `<p><strong>Labs:</strong> ${selectedLabs}</p>` : '',
    area ? `<p><strong>Area:</strong> ${area}</p>` : '',
    budget ? `<p><strong>Budget:</strong> ${budget}</p>` : '',
    timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : '',
    notes ? `<p><strong>Notes:</strong> ${notes}</p>` : '',
    '<p><strong>Message:</strong></p>',
    `<p>${message || 'No message provided'}</p>`,
  ].filter(Boolean).join('')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 0.5rem;">New enquiry submitted through Nimo Labs</h2>
      <p style="margin-bottom: 1rem;">The form was filled by <strong>${name}</strong> using the email address <strong>${email}</strong>.</p>
      ${detailHtml}
    </div>
  `

  return {
    subject,
    text: textLines.join('\n'),
    html,
  }
}

// ── SUBMIT contact form ───────────────────────────────────────
router.post('/', async (req, res) => {
  const body = req.body || {}
  const name = cleanText(body.name || body.contactName || body.fullName || body.full_name || '')
  const email = cleanText(body.email || body.contactEmail || body.emailAddress || '')
  const message = cleanText(body.message || body.notes || body.details || '')

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and message are required.'
    })
  }

  try {
    const mailPayload = formatPayload(body)
    const result = await sendEnquiryEmail({
      to: process.env.OWNER_EMAIL || process.env.SMTP_USER || 'hello@nimolabs.in',
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'hello@nimolabs.in',
      replyTo: email,
      subject: mailPayload.subject,
      text: mailPayload.text,
      html: mailPayload.html,
    })

    await sendThankYouEmail({
      to: email,
      name,
    })

    return res.status(200).json({
      success: true,
      message: result.skipped
        ? 'Your message was received. Email delivery is not configured yet.'
        : 'Your message has been received. We will get back to you soon!',
      mailSent: result.ok,
      mailSkipped: result.skipped,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({
      success: false,
      message: 'We could not send your message right now. Please try again later.',
    })
  }
})

module.exports = router
