const express = require('express')
const router = express.Router()
const db = require('../db')

// GET all venues
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM venues ORDER BY id DESC'

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(result)
  })
})

// POST create new venue
router.post('/', (req, res) => {
  const { name, address, location, country, capacity, contact } = req.body

  if (!name || !address || !location || !country || !capacity || !contact) {
    return res.status(400).json({ error: 'Please fill in all fields' })
  }

  const sql = `
    INSERT INTO venues (name, address, location, country, capacity, contact)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  db.query(sql, [name, address, location, country, capacity, contact], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(201).json({
      message: 'Venue created successfully',
      id: result.insertId
    })
  })
})

module.exports = router