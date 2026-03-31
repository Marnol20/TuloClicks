const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all attendees with event name
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      a.id,
      a.name,
      a.email,
      a.phone,
      a.ticket_type,
      a.registration_date,
      a.event_id,
      e.name AS event
    FROM attendees a
    LEFT JOIN events e ON a.event_id = e.id
    ORDER BY a.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ADD attendee
router.post('/', (req, res) => {
  const { name, email, phone, ticket_type, event_id } = req.body;

  if (!name || !email || !event_id) {
    return res.status(400).json({ error: 'Please fill in required fields' });
  }

  const today = new Date().toISOString().split('T')[0];

  const sql = `
    INSERT INTO attendees (name, email, phone, ticket_type, registration_date, event_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, phone || '', ticket_type || 'Standard', today, event_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Attendee added!' });
    }
  );
});

module.exports = router;