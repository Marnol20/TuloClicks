const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all events with venue info and speakers
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      e.id,
      e.name,
      e.description,
      e.date,
      e.location,
      e.status,
      e.venue_id,
      v.name AS venue
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.id
    ORDER BY e.id DESC
  `;

  db.query(sql, (err, events) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const speakerSql = `
      SELECT 
        es.event_id,
        s.name
      FROM event_speakers es
      JOIN speakers s ON es.speaker_id = s.id
    `;

    db.query(speakerSql, (speakerErr, speakerRows) => {
      if (speakerErr) {
        return res.status(500).json({ error: speakerErr.message });
      }

      const formattedEvents = events.map((event) => {
        const eventSpeakers = speakerRows
          .filter((row) => row.event_id === event.id)
          .map((row) => row.name);

        return {
          ...event,
          speakers: eventSpeakers
        };
      });

      res.json(formattedEvents);
    });
  });
});

// POST create event
router.post('/', (req, res) => {
  const { name, date, location, venue_id, description, status } = req.body;

  if (!name || !date || !location || !venue_id) {
    return res.status(400).json({ error: 'Name, date, location, and venue are required' });
  }

  const sql = `
    INSERT INTO events (name, description, date, location, venue_id, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name.trim(),
      description ? description.trim() : '',
      date.trim(),
      location.trim(),
      venue_id,
      status || 'Planning'
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: 'Event created successfully',
        id: result.insertId
      });
    }
  );
});

module.exports = router;