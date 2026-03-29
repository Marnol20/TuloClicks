const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  const sql = `
    SELECT 
      e.id,
      e.name,
      e.description,
      e.event_date AS date,
      e.location,
      v.name AS venue,
      e.status
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    ORDER BY e.id DESC
  `

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const formatted = result.map(function (event) {
      return {
        ...event,
        speakers: [],
      }
    })

    res.json(formatted)
  })
})

router.post('/', (req, res) => {
  const { name, date, location, venue } = req.body

  if (!name || !date || !location || !venue) {
    return res.status(400).json({ error: 'Please fill in all fields' })
  }

  const findVenueSql = `SELECT id FROM venues WHERE name = ? LIMIT 1`

  db.query(findVenueSql, [venue], (venueErr, venueResult) => {
    if (venueErr) {
      return res.status(500).json({ error: venueErr.message })
    }

    if (venueResult.length === 0) {
      return res.status(400).json({ error: 'Selected venue not found in database' })
    }

    const venueId = venueResult[0].id

    const insertSql = `
      INSERT INTO events (name, description, event_date, location, venue_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    db.query(insertSql, [name, '', date, location, venueId, 'Planning'], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).json({ error: insertErr.message })
      }

      res.status(201).json({
        message: 'Event created successfully',
        id: result.insertId,
      })
    })
  })
})

module.exports = router