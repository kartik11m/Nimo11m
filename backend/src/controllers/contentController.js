const Content = require('../models/Content')

exports.getAllContent = async (req, res) => {
  try {
    const content = await Content.find()
    res.status(200).json({ success: true, content })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.getContentByPage = async (req, res) => {
  try {
    const { page } = req.params
    const content = await Content.find({ page })
    res.status(200).json({ success: true, content })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.updateContent = async (req, res) => {
  try {
    const { key } = req.params
    const { content: newContent } = req.body

    if (!newContent) {
      return res.status(400).json({ success: false, message: 'Content is required' })
    }

    // Find by key, not by ID
    let updated = await Content.findOneAndUpdate(
      { key },
      { content: newContent },
      { new: true }
    )

    // If content doesn't exist, create it
    if (!updated) {
      updated = await Content.create({
        key,
        label: key,
        content: newContent,
        type: 'text'
      })
    }

    res.status(200).json({ success: true, content: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
