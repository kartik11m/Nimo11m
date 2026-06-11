const express = require('express')
const router = express.Router()

// ── GET all posts ─────────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all posts', 
    data: [] 
  })
})

// ── GET post by ID ────────────────────────────────────────────
router.get('/:id', (req, res) => {
  res.json({ 
    message: `Get post ${req.params.id}`, 
    id: req.params.id 
  })
})

// ── CREATE new post ───────────────────────────────────────────
router.post('/', (req, res) => {
  res.status(201).json({ 
    message: 'Post created successfully', 
    data: req.body 
  })
})

// ── UPDATE post ───────────────────────────────────────────────
router.put('/:id', (req, res) => {
  res.json({ 
    message: `Post ${req.params.id} updated`, 
    data: req.body 
  })
})

// ── DELETE post ───────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  res.json({ 
    message: `Post ${req.params.id} deleted` 
  })
})

module.exports = router
