const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_ATLAS_URI 
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/robolearn'

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ MongoDB connected successfully')
    console.log(`   Database: ${mongoose.connection.name}`)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
