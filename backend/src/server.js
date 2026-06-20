const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────
app.use(helmet()) // Security headers
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Allow localhost on any port during development
    if (origin.includes('localhost')) return callback(null, true)
    
    // In production, use CORS_ORIGIN env var
    const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
    if (origin === allowedOrigin) return callback(null, true)
    
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ extended: true, limit: '500mb' }))

// ── Database Connection ───────────────────────────────────────
const connectDB = require('./config/database')
const initializeOwner = require('./utils/initializeOwner')
const initializePhotos = require('./utils/initializePhotos')
const initializeVideos = require('./utils/initializeVideos')

connectDB()

// ── Initialize Owner Account ──────────────────────────────────
setTimeout(() => {
  initializeOwner()
}, 1000)

// ── Initialize Default Photos ─────────────────────────────────
setTimeout(() => {
  initializePhotos.initializePhotos()
}, 1500)

// ── Initialize Default Videos ─────────────────────────────────
setTimeout(() => {
  initializeVideos.initializeVideos()
}, 2000)

// ── API Routes ────────────────────────────────────────────────
app.use('/api', require('./routes/index'))

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  })
})

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  })
})

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 Environment: ${process.env.NODE_ENV}`)
})
