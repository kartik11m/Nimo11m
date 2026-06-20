const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const Video = require('../models/Video')

async function uploadVideo() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/robolearn'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Read the video file
    const videoPath = path.join(__dirname, '../../../public/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.20 PM.mp4')
    const videoBuffer = fs.readFileSync(videoPath)
    const base64Data = 'data:video/mp4;base64,' + videoBuffer.toString('base64')

    console.log('📹 Video file loaded:', (videoBuffer.length / (1024*1024)).toFixed(2), 'MB')

    // Create the video document
    const video = new Video({
      videoId: 'field-test-20260605',
      title: 'Field Test 2026-06-05',
      tag: 'Field Recording',
      src: base64Data,
      chapter: 'ch1',
      duration: '0:35',
      color: '#FF6B35',
      rgb: '255,107,53',
      order: await Video.countDocuments({ chapter: 'ch1' })
    })

    await video.save()
    console.log('✅ Video created successfully!')
    console.log('Video ID:', video._id)
    console.log('Title:', video.title)
    console.log('Chapter:', video.chapter)

    await mongoose.connection.close()
    console.log('✅ Database connection closed')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

uploadVideo()
