const Photo = require('../models/Photo')

// Seed initial photos to database
exports.initializePhotos = async () => {
  try {
    const existingCount = await Photo.countDocuments()
    
    // If photos already exist, don't re-seed
    if (existingCount > 0) {
      console.log(`✓ Photos already initialized (${existingCount} photos found)`)
      return
    }

    console.log('🎬 Initializing default photos...')

    // Chapter 1 photos
    const ch1Photos = [
      { photoId: 'c1-p1', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM.jpeg', caption: 'Chassis Assembly', tag: 'Mechanical', chapter: 'ch1', order: 0 },
      { photoId: 'c1-p2', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (1).jpeg', caption: 'Framework Build', tag: 'Electronics', chapter: 'ch1', order: 1 },
      { photoId: 'c1-p3', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (2).jpeg', caption: 'Electronics Setup', tag: 'Prototyping', chapter: 'ch1', order: 2 },
      { photoId: 'c1-p4', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.11 PM.jpeg', caption: 'Motor Configuration', tag: 'PCB Design', chapter: 'ch1', order: 3 },
      { photoId: 'c1-p5', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM.jpeg', caption: 'Sensor Array', tag: 'Firmware', chapter: 'ch1', order: 4 },
      { photoId: 'c1-p6', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM (1).jpeg', caption: 'PCB Layout Review', tag: 'Testing', chapter: 'ch1', order: 5 },
      { photoId: 'c1-p7', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM.jpeg', caption: 'Wiring Integration', tag: 'Iteration', chapter: 'ch1', order: 6 },
      { photoId: 'c1-p8', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM (1).jpeg', caption: 'Power Distribution', tag: 'Showcase', chapter: 'ch1', order: 7 },
    ]

    // Chapter 2 photos
    const ch2Photos = [
      { photoId: 'c2-p1', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.25 PM.jpeg', caption: 'Testing Phase', tag: 'Hardware', chapter: 'ch2', order: 0 },
      { photoId: 'c2-p2', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM.jpeg', caption: 'Field Deployment', tag: 'Control Loop', chapter: 'ch2', order: 1 },
      { photoId: 'c2-p3', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM (1).jpeg', caption: 'Team Assembly', tag: 'RF Engineering', chapter: 'ch2', order: 2 },
      { photoId: 'c2-p4', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.28 PM.jpeg', caption: 'Performance Test', tag: 'IoT', chapter: 'ch2', order: 3 },
      { photoId: 'c2-p5', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.29 PM.jpeg', caption: 'Component Detail', tag: 'Power Systems', chapter: 'ch2', order: 4 },
      { photoId: 'c2-p6', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.30 PM.jpeg', caption: 'Final Build', tag: 'Web UI', chapter: 'ch2', order: 5 },
      { photoId: 'c2-p7', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.33 PM.jpeg', caption: 'Documentation', tag: 'Field Testing', chapter: 'ch2', order: 6 },
      { photoId: 'c2-p8', src: '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.35 PM.jpeg', caption: 'Nimo in Action', tag: 'Showcase', chapter: 'ch2', order: 7 },
    ]

    // Chapter 3 photos (empty, but ready for owner to add)
    const ch3Photos = []

    const allPhotos = [...ch1Photos, ...ch2Photos, ...ch3Photos]
    
    await Photo.insertMany(allPhotos)
    console.log(`✓ Initialized ${allPhotos.length} photos`)
  } catch (error) {
    // If unique constraint error, photos already exist
    if (error.code === 11000) {
      console.log('✓ Photos already initialized')
    } else {
      console.error('Error initializing photos:', error.message)
    }
  }
}
