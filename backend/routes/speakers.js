const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all speakers with event name
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.name,
      s.role,
      s.email,
      e.id AS event_id,
      e.name AS event
    FROM speakers s
    LEFT JOIN event_speakers es ON s.id = es.speaker_id
    LEFT JOIN events e ON es.event_id = e.id
    ORDER BY s.id DESC
  `;

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(data);
  });
});

// POST new speaker and connect to event
router.post('/', (req, res) => {
  const { name, role, email, event_id } = req.body;

  if (!name || !role || !email || !event_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const insertSpeakerSql = `
    INSERT INTO speakers (name, role, email)
    VALUES (?, ?, ?)
  `;

  db.query(insertSpeakerSql, [name, role, email], (err, speakerResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const speaker_id = speakerResult.insertId;

    const linkSql = `
      INSERT INTO event_speakers (event_id, speaker_id)
      VALUES (?, ?)
    `;

    db.query(linkSql, [event_id, speaker_id], (linkErr) => {
      if (linkErr) {
        return res.status(500).json({ error: linkErr.message });
      }

      res.status(201).json({
        message: 'Speaker added successfully',
        id: speaker_id
      });
    });
  });
});

module.exports = router;