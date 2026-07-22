const mongoose = require('mongoose')

let isConnecting = false

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection
  }

  const mongoURI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI

  if (!mongoURI) {
    throw new Error('MONGODB_URI / MONGODB_ATLAS_URI environment variable is not configured in Vercel settings!')
  }

  if (isConnecting) return

  try {
    isConnecting = true
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })

    console.log('✅ MongoDB connected successfully:', mongoose.connection.name)
    return mongoose.connection
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    throw error
  } finally {
    isConnecting = false
  }
}

module.exports = connectDB
