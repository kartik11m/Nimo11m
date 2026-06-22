const express = require('express')
const router = express.Router()
const { protectOwner } = require('../middleware/ownerAuth')
const cardController = require('../controllers/cardController')

// ── PUBLIC ROUTES (anyone can fetch) ──────────────────────────
router.get('/', cardController.getAllCards)
router.get('/:id', cardController.getCard)

// ── PROTECTED ROUTES (owner only) ─────────────────────────────
router.post('/', protectOwner, cardController.createCard)
router.put('/:id', protectOwner, cardController.updateCard)
router.delete('/:id', protectOwner, cardController.deleteCard)
router.post('/reorder', protectOwner, cardController.reorderCards)

module.exports = router
