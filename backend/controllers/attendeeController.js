const db = require('../db')

const getAllAttendees = (req, res) => {
  const sql = `
    SELECT 
      a.id,
      a.name,
      a.email,
      a.event_id,
      e.name AS event,
      a.ticket_type,
      a.registration_date,
      a.created_at
    FROM attendees a
    LEFT JOIN events e ON a.event_id = e.id
    ORDER BY a.id DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to fetch attendees',
        error: err.message,
      })
    }

    res.json(results)
  })
}

const getAttendeeById = (req, res) => {
  const { id } = req.params

const sql = `
  SELECT 
    a.id,
    a.name,
    a.email,
    a.event_id,
    e.name AS event,
    a.ticket_type,
    a.registration_date,
    a.created_at
  FROM attendees a
  LEFT JOIN events e ON a.event_id = e.id
  WHERE a.id = ?
`

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to fetch attendee',
        error: err.message,
      })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Attendee not found' })
    }

    res.json(results[0])
  })
}

const createAttendee = (req, res) => {
  const { name, email, event_id, ticket_type, registration_date } = req.body

  if (!name || !email || !event_id || !ticket_type) {
    return res.status(400).json({ message: 'Please fill in all required fields' })
  }

  const finalDate = registration_date || new Date().toISOString().split('T')[0]

  const sql = `
    INSERT INTO attendees (name, email, event_id, ticket_type, registration_date)
    VALUES (?, ?, ?, ?, ?)
  `

  db.query(sql, [name, email, event_id, ticket_type, finalDate], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to create attendee',
        error: err.message,
      })
    }

    res.status(201).json({
      message: 'Attendee created successfully',
      id: result.insertId,
    })
  })
}

const updateAttendee = (req, res) => {
  const { id } = req.params
  const { name, email, event_id, ticket_type } = req.body

  if (!name || !email || !event_id || !ticket_type) {
    return res.status(400).json({ message: 'Please fill in all required fields' })
  }

  const sql = `
    UPDATE attendees
    SET name = ?, email = ?, event_id = ?, ticket_type = ?
    WHERE id = ?
  `

  db.query(sql, [name, email, event_id, ticket_type, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to update attendee',
        error: err.message,
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendee not found' })
    }

    res.json({ message: 'Attendee updated successfully' })
  })
}

const deleteAttendee = (req, res) => {
  const { id } = req.params

  const sql = `DELETE FROM attendees WHERE id = ?`

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to delete attendee',
        error: err.message,
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attendee not found' })
    }

    res.json({ message: 'Attendee deleted successfully' })
  })
}

module.exports = {
  getAllAttendees,
  getAttendeeById,
  createAttendee,
  updateAttendee,
  deleteAttendee,
}