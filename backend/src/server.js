const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

module.exports = app

// ── Middleware ────────────────────────────────────────────────
app.use(helmet()) // Security headers
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ]

    if (process.env.CORS_ORIGIN) {
      allowedOrigins.push(process.env.CORS_ORIGIN)
    }

    if (allowedOrigins.includes(origin)) return callback(null, true)
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app') || origin.includes('netlify.app')) {
      return callback(null, true)
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ extended: true, limit: '500mb' }))
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Range')
  res.setHeader('Accept-Ranges', 'bytes')
  next()
}, express.static(path.join(__dirname, '../public/uploads'), {
  maxAge: 0,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache')
  },
}))

// ── Database Connection ───────────────────────────────────────
const connectDB = require('./config/database')
const initializeOwner = require('./utils/initializeOwner')
const initializePhotos = require('./utils/initializePhotos')
const initializeVideos = require('./utils/initializeVideos')
const initializeChapters = require('./utils/initializeChapters')
const initializeCourses = require('./utils/initializeCourses')
const initializeEvents = require('./utils/initializeEvents')
const initializeCards = require('./utils/initializeCards')

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

// ── Initialize Chapters ───────────────────────────────────────
setTimeout(() => {
  initializeChapters()
}, 2500)

// ── Initialize Courses ────────────────────────────────────────
setTimeout(() => {
  initializeCourses()
}, 3000)

// ── Initialize Events ─────────────────────────────────────────
setTimeout(() => {
  initializeEvents()
}, 3500)
// ── Initialize Cards ──────────────────────────────────────
setTimeout(() => {
  initializeCards()
}, 4000)
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

// ── Root + Favicon ───────────────────────────────────────────
app.get('/favicon.ico', (req, res) => res.status(204).end())

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Nimo Labs Backend',
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
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📡 Environment: ${process.env.NODE_ENV}`)
  })
}
