const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

const Video = require('../models/Video')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/robolearn'

async function addNimoVideo() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    const videoPath = path.join(__dirname, '../../../public/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.20 PM.mp4')
    
    if (!fs.existsSync(videoPath)) {
      console.error('❌ Video file not found:', videoPath)
      process.exit(1)
    }

    // Read video file
    const videoData = fs.readFileSync(videoPath)
    const base64String = `data:video/mp4;base64,${videoData.toString('base64')}`
    console.log('✅ Video file read and converted to base64')

    // Find and update existing video for section-1
    const updatedVideo = await Video.findOneAndUpdate(
      { page: 'section-1' },
      {
        src: base64String,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (updatedVideo) {
      console.log('✅ Updated existing video for section-1')
      console.log('   VideoId:', updatedVideo.videoId)
      console.log('   Title:', updatedVideo.title)
      console.log('   Data size:', base64String.length, 'bytes')
    } else {
      console.log('⚠️  No existing video found for section-1, creating new one...')
      
      const newVideo = new Video({
        videoId: `section-1-${Date.now()}`,
        src: base64String,
        title: 'Nimo Draft Video',
        tag: 'Section',
        chapter: 'ch1',
        page: 'section-1',
        duration: '0:00',
        color: '#FF6B35',
        rgb: '255,107,53',
        order: 0,
      })
      
      await newVideo.save()
      console.log('✅ Created new video for section-1')
      console.log('   VideoId:', newVideo.videoId)
      console.log('   Data size:', base64String.length, 'bytes')
    }

    await mongoose.connection.close()
    console.log('✅ Script completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

addNimoVideo()
