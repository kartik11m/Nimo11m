const mongoose = require('mongoose')

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  try {
    const mongoURI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/robolearn'

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ MongoDB connected successfully')
    console.log(`   Database: ${mongoose.connection.name}`)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
  }
}

module.exports = connectDB
