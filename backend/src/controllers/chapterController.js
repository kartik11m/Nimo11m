const Chapter = require('../models/Chapter')
const Video = require('../models/Video')

// Get all chapters
exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ order: 1 })
    res.json({ success: true, chapters })
  } catch (error) {
    console.error('Error fetching chapters:', error.message)
    res.status(500).json({ success: false, message: 'Error fetching chapters' })
  }
}

// Get chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    const { chapterId } = req.params
    const chapter = await Chapter.findOne({ chapterId })
    
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' })
    }
    
    res.json({ success: true, chapter })
  } catch (error) {
    console.error('Error fetching chapter:', error.message)
    res.status(500).json({ success: false, message: 'Error fetching chapter' })
  }
}

// Create new chapter
exports.createChapter = async (req, res) => {
  try {
    const { chapterId, name, displayName, description, color, rgb, order } = req.body

    // Validate required fields
    if (!chapterId || !name || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'chapterId, name, and displayName are required',
      })
    }

    // Check if chapter already exists
    const existing = await Chapter.findOne({ chapterId })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Chapter with this ID already exists',
      })
    }

    const chapter = new Chapter({
      chapterId,
      name,
      displayName,
      description: description || '',
      color: color || '#FF6B35',
      rgb: rgb || '255,107,53',
      order: order || (await Chapter.countDocuments()),
      isActive: true,
    })

    await chapter.save()
    console.log('Chapter created:', chapterId)
    res.status(201).json({ success: true, chapter })
  } catch (error) {
    console.error('Error creating chapter:', error.message)
    res.status(500).json({ success: false, message: 'Error creating chapter', error: error.message })
  }
}

// Update chapter
exports.updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params
    const { name, displayName, description, color, rgb, order, isActive } = req.body

    const chapter = await Chapter.findOne({ chapterId })
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' })
    }

    // Update fields
    if (name !== undefined) chapter.name = name
    if (displayName !== undefined) chapter.displayName = displayName
    if (description !== undefined) chapter.description = description
    if (color !== undefined) chapter.color = color
    if (rgb !== undefined) chapter.rgb = rgb
    if (order !== undefined) chapter.order = order
    if (isActive !== undefined) chapter.isActive = isActive
    chapter.updatedAt = new Date()

    await chapter.save()
    console.log('Chapter updated:', chapterId)
    res.json({ success: true, chapter })
  } catch (error) {
    console.error('Error updating chapter:', error.message)
    res.status(500).json({ success: false, message: 'Error updating chapter', error: error.message })
  }
}

// Delete chapter
exports.deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params

    // Check if chapter has videos
    const videoCount = await Video.countDocuments({ chapter: chapterId })
    if (videoCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete chapter with ${videoCount} video(s). Please delete all videos first.`,
      })
    }

    const chapter = await Chapter.findOneAndDelete({ chapterId })
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' })
    }

    console.log('Chapter deleted:', chapterId)
    res.json({ success: true, message: 'Chapter deleted', chapter })
  } catch (error) {
    console.error('Error deleting chapter:', error.message)
    res.status(500).json({ success: false, message: 'Error deleting chapter', error: error.message })
  }
}

// Force delete chapter and all its videos
exports.deleteChapterAndVideos = async (req, res) => {
  try {
    const { chapterId } = req.params

    // Delete all videos in this chapter
    const deleteResult = await Video.deleteMany({ chapter: chapterId })
    console.log(`Deleted ${deleteResult.deletedCount} videos from chapter ${chapterId}`)

    // Delete the chapter
    const chapter = await Chapter.findOneAndDelete({ chapterId })
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' })
    }

    console.log('Chapter and all videos deleted:', chapterId)
    res.json({ 
      success: true, 
      message: 'Chapter and all videos deleted',
      chapter,
      videosDeleted: deleteResult.deletedCount
    })
  } catch (error) {
    console.error('Error deleting chapter and videos:', error.message)
    res.status(500).json({ success: false, message: 'Error deleting chapter', error: error.message })
  }
}
