const Video = require('../models/Video')

// Seed initial videos to database
exports.initializeVideos = async () => {
  try {
    const existingCount = await Video.countDocuments()
    
    // If videos already exist, don't re-seed
    if (existingCount > 0) {
      console.log(`✓ Videos already initialized (${existingCount} videos found)`)
      return
    }

    console.log('🎬 Initializing default videos...')

    // Chapter 1 videos
    const ch1Videos = [
      { videoId: 'c1-v1', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.15 PM.mp4', title: 'Nimo Build 1', tag: 'Mechanical Build', chapter: 'ch1', color: '#FF6B35', rgb: '255,107,53', duration: '0:45', order: 0 },
      { videoId: 'c1-v2', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.20 PM.mp4', title: 'Nimo Build 2', tag: 'Electronics', chapter: 'ch1', color: '#FF6B35', rgb: '255,107,53', duration: '0:52', order: 1 },
      { videoId: 'c1-v3', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.25 PM.mp4', title: 'Nimo Build 3', tag: 'Embedded Systems', chapter: 'ch1', color: '#FF006E', rgb: '255,0,110', duration: '0:38', order: 2 },
      { videoId: 'c1-v4', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.25 PM (1).mp4', title: 'Nimo Build 4', tag: 'Circuit Design', chapter: 'ch1', color: '#FF6B35', rgb: '255,107,53', duration: '0:41', order: 3 },
      { videoId: 'c1-v5', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.27 PM.mp4', title: 'Nimo Build 5', tag: 'Testing & Debug', chapter: 'ch1', color: '#00F5FF', rgb: '0,245,255', duration: '0:55', order: 4 },
      { videoId: 'c1-v6', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.27 PM (1).mp4', title: 'Nimo Build 6', tag: 'Hardware Engineering', chapter: 'ch1', color: '#A855F7', rgb: '168,85,247', duration: '0:47', order: 5 },
    ]

    // Chapter 2 videos
    const ch2Videos = [
      { videoId: 'c2-v1', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.31 PM.mp4', title: 'Sensor Array Rig', tag: 'Sensor Fusion', chapter: 'ch2', color: '#00F5FF', rgb: '0,245,255', duration: '0:50', order: 0 },
      { videoId: 'c2-v2', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.31 PM (1).mp4', title: 'PID Tuning Demo', tag: 'Motor Control', chapter: 'ch2', color: '#FF6B35', rgb: '255,107,53', duration: '0:43', order: 1 },
      { videoId: 'c2-v3', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.32 PM.mp4', title: 'ESP-NOW Latency Test', tag: 'Wireless Link', chapter: 'ch2', color: '#A855F7', rgb: '168,85,247', duration: '0:39', order: 2 },
      { videoId: 'c2-v4', src: '/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.32 PM (1).mp4', title: 'Live MQTT Dashboard', tag: 'IoT Cloud', chapter: 'ch2', color: '#00F5FF', rgb: '0,245,255', duration: '0:48', order: 3 },
    ]

    // Chapter 3 videos (empty, but ready for owner to add)
    const ch3Videos = []

    const allVideos = [...ch1Videos, ...ch2Videos, ...ch3Videos]
    
    await Video.insertMany(allVideos)
    console.log(`✓ Initialized ${allVideos.length} videos`)
  } catch (error) {
    // If unique constraint error, videos already exist
    if (error.code === 11000) {
      console.log('✓ Videos already initialized')
    } else {
      console.error('Error initializing videos:', error.message)
    }
  }
}
