const Photo = require('../models/Photo')

// Get all photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ chapter: 1, order: 1 })
    res.json({ success: true, photos })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get photos by chapter
exports.getPhotosByChapter = async (req, res) => {
  try {
    const { chapter } = req.params
    const photos = await Photo.find({ chapter }).sort({ order: 1 })
    res.json({ success: true, photos })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get photos by page
exports.getPhotosByPage = async (req, res) => {
  try {
    const { page } = req.params
    const photos = await Photo.find({ page }).sort({ chapter: 1, order: 1 })
    res.json({ success: true, photos })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Create a new photo
exports.createPhoto = async (req, res) => {
  try {
    const { photoId, src, caption, tag, chapter, order, page } = req.body

    if (!photoId || !src || !caption || !tag || !chapter) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: photoId, src, caption, tag, chapter',
      })
    }

    // Check if photo already exists
    const existingPhoto = await Photo.findOne({ photoId })
    if (existingPhoto) {
      return res.status(400).json({
        success: false,
        message: `Photo with ID "${photoId}" already exists`,
      })
    }

    const photo = new Photo({
      photoId,
      src,
      caption,
      tag,
      chapter,
      order: order || 0,
      page: page || 'robots',
    })

    await photo.save()
    res.status(201).json({ success: true, photo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update a photo
exports.updatePhoto = async (req, res) => {
  try {
    const { photoId } = req.params
    const { src, caption, tag, order } = req.body

    // Try to find by photoId first, then by MongoDB _id
    let photo = await Photo.findOne({ photoId })
    
    if (!photo) {
      // Try finding by MongoDB _id if photoId didn't work
      photo = await Photo.findById(photoId)
    }

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: `Photo with ID "${photoId}" not found`,
      })
    }

    // Update fields if provided
    if (src !== undefined) photo.src = src
    if (caption !== undefined) photo.caption = caption
    if (tag !== undefined) photo.tag = tag
    if (order !== undefined) photo.order = order

    await photo.save()
    res.json({ success: true, photo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete a photo
exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params

    // Try to find by photoId first, then by MongoDB _id
    let photo = await Photo.findOneAndDelete({ photoId })
    
    if (!photo) {
      // Try finding by MongoDB _id if photoId didn't work
      photo = await Photo.findByIdAndDelete(photoId)
    }

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: `Photo with ID "${photoId}" not found`,
      })
    }

    res.json({ success: true, message: 'Photo deleted successfully', photo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
