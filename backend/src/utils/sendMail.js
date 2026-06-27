const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = process.env.SMTP_SECURE === 'true' || port === 465

  if (!host || !user || !pass) {
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  return transporter
}

async function sendEnquiryEmail({ to, from, replyTo, subject, text, html }) {
  const transport = getTransporter()

  if (!transport) {
    return { ok: false, skipped: true, message: 'Email transport not configured.' }
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: replyTo || from || process.env.SMTP_FROM || process.env.SMTP_USER,
    subject,
    text,
    html,
  })

  return { ok: true, skipped: false }
}

async function sendThankYouEmail({ to, name }) {
  const transport = getTransporter()

  if (!transport) {
    return { ok: false, skipped: true, message: 'Email transport not configured.' }
  }

  const html = `
    <div style="font-family: Arial, sans-serif; background: #050508; color: #f5f1e8; padding: 24px; border-radius: 16px; max-width: 640px; margin: 0 auto;">
      <div style="background: linear-gradient(90deg, #ff6b35, #8b31e8); padding: 2px; border-radius: 16px;">
        <div style="background: #0f0f14; border-radius: 14px; padding: 28px;">
          <h2 style="margin: 0 0 10px; color: #ff6b35; font-size: 24px;">Thank you for your interest, ${name || 'there'}!</h2>
          <p style="font-size: 15px; line-height: 1.7; color: #e8e4d8;">
            We have received your enquiry and our team will reach out to you shortly.
            We appreciate the opportunity to connect with you and help with your robotics learning journey.
          </p>
          <div style="margin: 20px 0; padding: 14px 18px; border: 1px solid rgba(255,107,53,0.25); background: rgba(255,107,53,0.08); border-radius: 10px;">
            <p style="margin: 0; font-size: 14px; color: #ffb08a;">Expected response time: within 24 hours</p>
          </div>
          <p style="margin: 0; font-size: 13px; color: #9ca3af;">Warm regards,<br/>The RoboLearn Team</p>
        </div>
      </div>
    </div>
  `

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: process.env.SMTP_FROM || process.env.SMTP_USER,
    subject: 'Thank you for reaching out to Nimo Labs',
    text: `Hi ${name || 'there'},\n\nThank you for your interest in RoboLearn. We have received your enquiry and our team will get back to you soon.\n\nWarm regards,\nThe RoboLearn Team`,
    html,
  })

  return { ok: true, skipped: false }
}

module.exports = { sendEnquiryEmail, sendThankYouEmail }
