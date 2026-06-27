const Owner = require('../models/Owner')
const { signOwnerToken } = require('../utils/authToken')

exports.register = async (req, res) => {
  try {
    // Check if any owner already exists - prevent multiple registrations
    const existingOwner = await Owner.findOne({})
    
    if (existingOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'Owner account already exists. Please login instead.' 
      })
    }

    const { name, email, password, passwordConfirm } = req.body

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' })
    }

    const owner = await Owner.create({
      name,
      email,
      password,
    })

    // Create JWT token
    const token = signOwnerToken({ id: owner._id })

    res.status(201).json({
      success: true,
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const owner = await Owner.findOne({ email }).select('+password')

    if (!owner || !(await owner.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Create JWT token
    const token = signOwnerToken({ id: owner._id })

    res.status(200).json({
      success: true,
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.getOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.owner.id)
    res.status(200).json({ success: true, owner })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
