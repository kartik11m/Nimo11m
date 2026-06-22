const Card = require('../models/Card')

// ── GET ALL CARDS ──────────────────────────────────────────────
exports.getAllCards = async (req, res) => {
  try {
    const { cardType, page } = req.query
    const query = {}
    
    if (cardType) query.cardType = cardType
    if (page) query.page = page
    query.active = true
    
    const cards = await Card.find(query).sort({ index: 1 })
    res.json({ success: true, data: cards })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── GET SINGLE CARD ────────────────────────────────────────────
exports.getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' })
    res.json({ success: true, data: card })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── CREATE CARD ────────────────────────────────────────────────
exports.createCard = async (req, res) => {
  try {
    const { cardType, page, data } = req.body
    
    // Get the next index
    const lastCard = await Card.findOne({ cardType, page }).sort({ index: -1 })
    const nextIndex = lastCard ? lastCard.index + 1 : 0
    
    const card = new Card({
      cardType,
      page: page || 'achievements',
      index: nextIndex,
      data,
      active: true,
    })
    
    await card.save()
    res.status(201).json({ success: true, data: card })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── UPDATE CARD ────────────────────────────────────────────────
exports.updateCard = async (req, res) => {
  try {
    const { data, index, active } = req.body
    const updateObj = {}
    
    // Merge data fields instead of replacing
    if (data) {
      const card = await Card.findById(req.params.id)
      if (card) {
        updateObj.data = { ...card.data, ...data }
      } else {
        updateObj.data = data
      }
    }
    
    if (index !== undefined) updateObj.index = index
    if (active !== undefined) updateObj.active = active
    
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    )
    
    if (!updatedCard) return res.status(404).json({ success: false, message: 'Card not found' })
    res.json({ success: true, data: updatedCard })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── DELETE CARD ────────────────────────────────────────────────
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
    
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' })
    res.json({ success: true, message: 'Card deleted', data: card })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ── REORDER CARDS ──────────────────────────────────────────────
exports.reorderCards = async (req, res) => {
  try {
    const { cardType, page, cardIds } = req.body
    
    // Update indices for all cards in order
    const updates = cardIds.map((id, idx) => ({
      updateOne: {
        filter: { _id: id, cardType, page },
        update: { index: idx },
      }
    }))
    
    await Card.bulkWrite(updates)
    const cards = await Card.find({ cardType, page, active: true }).sort({ index: 1 })
    
    res.json({ success: true, message: 'Cards reordered', data: cards })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
