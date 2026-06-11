const express = require('express')
const router = express.Router()

// ── GET all users ─────────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all users', 
    data: [] 
  })
})

// ── GET user by ID ────────────────────────────────────────────
router.get('/:id', (req, res) => {
  res.json({ 
    message: `Get user ${req.params.id}`, 
    id: req.params.id 
  })
})

// ── CREATE new user ───────────────────────────────────────────
router.post('/', (req, res) => {
  res.status(201).json({ 
    message: 'User created successfully', 
    data: req.body 
  })
})

// ── UPDATE user ───────────────────────────────────────────────
router.put('/:id', (req, res) => {
  res.json({ 
    message: `User ${req.params.id} updated`, 
    data: req.body 
  })
})

// ── DELETE user ───────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  res.json({ 
    message: `User ${req.params.id} deleted` 
  })
})

module.exports = router
