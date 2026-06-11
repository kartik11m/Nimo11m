const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { AppError } = require('../middleware/errorHandler')

// ── Generate JWT Token ────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

// ── Admin Register ────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return next(new AppError('Please provide all required fields', 400))
    }

    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 400))
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return next(new AppError('Email already in use', 400))
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Register as admin
      isActive: true,
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ── Admin Login ───────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400))
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return next(new AppError('Invalid email or password', 401))
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return next(new AppError('Invalid email or password', 401))
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return next(new AppError('You do not have admin privileges', 403))
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 403))
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ── Admin Logout ──────────────────────────────────────────────
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}

// ── Get Current User ──────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ── Get All Users (admin only) ────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    next(error)
  }
}

// ── Update User ───────────────────────────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, email } = req.body

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    )

    if (!user) {
      return next(new AppError('User not found', 404))
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    })
  } catch (error) {
    next(error)
  }
}

// ── Update User Role ──────────────────────────────────────────
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!['student', 'instructor', 'admin'].includes(role)) {
      return next(new AppError('Invalid role', 400))
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    )

    if (!user) {
      return next(new AppError('User not found', 404))
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user,
    })
  } catch (error) {
    next(error)
  }
}

// ── Delete User ───────────────────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    // Prevent deleting yourself
    if (req.user.id === id) {
      return next(new AppError('You cannot delete your own account', 400))
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return next(new AppError('User not found', 404))
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
