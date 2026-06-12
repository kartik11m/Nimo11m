const Owner = require('../models/Owner')

async function initializeOwner() {
  try {
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@robolearn.com'
    const ownerPassword = process.env.OWNER_PASSWORD || 'ChangeMe@1234'

    // Check if owner already exists
    const existingOwner = await Owner.findOne({ email: ownerEmail })

    if (existingOwner) {
      console.log('✅ Owner account already exists:', ownerEmail)
      return
    }

    // Create owner account
    const owner = await Owner.create({
      name: 'Owner',
      email: ownerEmail,
      password: ownerPassword,
    })

    console.log('✅ Owner account created successfully!')
    console.log('📧 Email:', ownerEmail)
    console.log('🔑 Password: (set in OWNER_PASSWORD env variable)')
    console.log('⚠️  Change these credentials after first login!')

    return owner
  } catch (error) {
    console.error('❌ Error initializing owner:', error.message)
  }
}

module.exports = initializeOwner
