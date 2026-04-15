const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * PUBLIC: get venues
 */
router.get('/', async (req, res) => {
  try {
    const [venues] = await db.query(`
      SELECT
        id,
        name,
        address,
        city,
        province,
        country,
        postal_code,
        capacity,
        contact_person,
        contact_phone,
        contact_email,
        created_at,
        updated_at
      FROM venues
      ORDER BY created_at DESC
    `);

    return res.json(venues);
  } catch (error) {
    console.error('Get venues error:', error);
    return res.status(500).json({ error: 'Server error fetching venues.' });
  }
});

/**
 * GET one venue
 */
router.get('/:id', async (req, res) => {
  try {
    const venueId = Number(req.params.id);

    const [venues] = await db.query(
      `
      SELECT
        id,
        name,
        address,
        city,
        province,
        country,
        postal_code,
        capacity,
        contact_person,
        contact_phone,
        contact_email,
        created_at,
        updated_at
      FROM venues
      WHERE id = ?
      LIMIT 1
      `,
      [venueId]
    );

    if (venues.length === 0) {
      return res.status(404).json({ error: 'Venue not found.' });
    }

    return res.json(venues[0]);
  } catch (error) {
    console.error('Get venue error:', error);
    return res.status(500).json({ error: 'Server error fetching venue.' });
  }
});

/**
 * ADMIN or ORGANIZER: create venue
 */
router.post('/', authMiddleware, roleMiddleware('admin', 'organizer'), async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      province,
      country,
      postal_code,
      capacity,
      contact_person,
      contact_phone,
      contact_email
    } = req.body;

    if (!name || !address || !city || !capacity) {
      return res.status(400).json({ error: 'Name, address, city, and capacity are required.' });
    }

    const [result] = await db.query(
      `
      INSERT INTO venues
      (
        name,
        address,
        city,
        province,
        country,
        postal_code,
        capacity,
        contact_person,
        contact_phone,
        contact_email
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        address.trim(),
        city.trim(),
        province || null,
        country || 'Philippines',
        postal_code || null,
        Number(capacity),
        contact_person || null,
        contact_phone || null,
        contact_email || null
      ]
    );

    return res.status(201).json({
      message: 'Venue created successfully.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create venue error:', error);
    return res.status(500).json({ error: 'Server error creating venue.' });
  }
});

/**
 * ADMIN or ORGANIZER: update venue
 */
router.put('/:id', authMiddleware, roleMiddleware('admin', 'organizer'), async (req, res) => {
  try {
    const venueId = Number(req.params.id);
    const {
      name,
      address,
      city,
      province,
      country,
      postal_code,
      capacity,
      contact_person,
      contact_phone,
      contact_email
    } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(String(name).trim());
    }

    if (address !== undefined) {
      updates.push('address = ?');
      values.push(String(address).trim());
    }

    if (city !== undefined) {
      updates.push('city = ?');
      values.push(String(city).trim());
    }

    if (province !== undefined) {
      updates.push('province = ?');
      values.push(province ? String(province).trim() : null);
    }

    if (country !== undefined) {
      updates.push('country = ?');
      values.push(country ? String(country).trim() : 'Philippines');
    }

    if (postal_code !== undefined) {
      updates.push('postal_code = ?');
      values.push(postal_code ? String(postal_code).trim() : null);
    }

    if (capacity !== undefined) {
      updates.push('capacity = ?');
      values.push(Number(capacity));
    }

    if (contact_person !== undefined) {
      updates.push('contact_person = ?');
      values.push(contact_person ? String(contact_person).trim() : null);
    }

    if (contact_phone !== undefined) {
      updates.push('contact_phone = ?');
      values.push(contact_phone ? String(contact_phone).trim() : null);
    }

    if (contact_email !== undefined) {
      updates.push('contact_email = ?');
      values.push(contact_email ? String(contact_email).trim().toLowerCase() : null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    values.push(venueId);

    const [result] = await db.query(
      `UPDATE venues SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Venue not found.' });
    }

    return res.json({ message: 'Venue updated successfully.' });
  } catch (error) {
    console.error('Update venue error:', error);
    return res.status(500).json({ error: 'Server error updating venue.' });
  }
});

/**
 * ADMIN: delete venue
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const venueId = Number(req.params.id);

    const [result] = await db.query(
      `DELETE FROM venues WHERE id = ?`,
      [venueId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Venue not found.' });
    }

    return res.json({ message: 'Venue deleted successfully.' });
  } catch (error) {
    console.error('Delete venue error:', error);
    return res.status(500).json({ error: 'Server error deleting venue.' });
  }
});

module.exports = router;