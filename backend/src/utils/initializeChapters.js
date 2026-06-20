const Chapter = require('../models/Chapter')

const defaultChapters = [
  {
    chapterId: 'ch1',
    name: 'Chapter One',
    displayName: 'Chapter One · Basics',
    description: 'Learn robotics fundamentals and core concepts',
    color: '#FF6B35',
    rgb: '255,107,53',
    order: 0,
    isActive: true,
  },
  {
    chapterId: 'ch2',
    name: 'Chapter Two',
    displayName: 'Chapter Two · Advanced',
    description: 'Dive deeper into advanced robotics systems',
    color: '#00F5FF',
    rgb: '0,245,255',
    order: 1,
    isActive: true,
  },
  {
    chapterId: 'ch3',
    name: 'Chapter Three',
    displayName: 'Chapter Three · Expert',
    description: 'Master complex robotics applications',
    color: '#A855F7',
    rgb: '168,85,247',
    order: 2,
    isActive: true,
  },
]

async function initializeChapters() {
  try {
    const existingCount = await Chapter.countDocuments()
    
    if (existingCount === 0) {
      console.log('📚 Initializing default chapters...')
      await Chapter.insertMany(defaultChapters)
      console.log(`✓ Default chapters initialized (${defaultChapters.length} chapters created)`)
    } else {
      console.log(`✓ Chapters already initialized (${existingCount} chapters found)`)
    }
  } catch (error) {
    console.error('Error initializing chapters:', error.message)
  }
}

module.exports = initializeChapters
