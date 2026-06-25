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
    const { content: newContent, page, label, type } = req.body

    if (newContent === undefined) {
      return res.status(400).json({ success: false, message: 'Content is required' })
    }

    const updatePayload = {
      content: newContent,
      ...(page ? { page } : {}),
      ...(label ? { label } : {}),
      ...(type ? { type } : {}),
    }

    const updated = await Content.findOneAndUpdate(
      { key },
      { $set: updatePayload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    res.status(200).json({ success: true, content: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
