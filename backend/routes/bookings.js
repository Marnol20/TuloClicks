const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const logActivity = require('../utils/logger');
const createNotification = require('../utils/notify');

const router = express.Router();

function generateBookingReference() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TC-${year}-${random}`;
}

/**
 * ORGANIZER/ADMIN: verify booking by QR reference
 */
router.get('/verify/:reference', authMiddleware, roleMiddleware('organizer', 'admin'), async (req, res) => {
  try {
    const bookingReference = req.params.reference;

    const [rows] = await db.query(
      `
      SELECT
        b.*,
        e.title AS event_title,
        e.organizer_id
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.booking_reference = ?
      LIMIT 1
      `,
      [bookingReference]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const booking = rows[0];

    if (req.user.role !== 'admin' && booking.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied for this booking.' });
    }

    return res.json({
      valid: true,
      booking
    });
  } catch (error) {
    console.error('Verify booking error:', error);
    return res.status(500).json({ error: 'Server error verifying booking.' });
  }
});

/**
 * USER: create booking
 */
router.post('/', authMiddleware, roleMiddleware('user', 'organizer', 'admin'), async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      event_id,
      attendee_name,
      attendee_email,
      attendee_phone,
      items
    } = req.body;

    if (!event_id || !attendee_name || !attendee_email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Event, attendee details, and at least one ticket item are required.'
      });
    }

    await connection.beginTransaction();

    const [events] = await connection.query(
      `
      SELECT *
      FROM events
      WHERE id = ?
        AND approval_status = 'approved'
        AND publish_status = 'published'
      LIMIT 1
      `,
      [Number(event_id)]
    );

    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Event not found or not available for booking.' });
    }

    const event = events[0];

    const ticketIds = items.map(item => Number(item.ticket_type_id)).filter(Boolean);

    if (ticketIds.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'No valid ticket types provided.' });
    }

    const [ticketRows] = await connection.query(
      `
      SELECT *
      FROM ticket_types
      WHERE event_id = ?
        AND id IN (?)
        AND is_active = 1
      `,
      [Number(event_id), ticketIds]
    );

    if (ticketRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'No valid ticket types found for this event.' });
    }

    let totalAmount = 0;
    const bookingItems = [];

    for (const item of items) {
      const ticket = ticketRows.find(t => t.id === Number(item.ticket_type_id));
      const quantity = Number(item.quantity);

      if (!ticket) {
        await connection.rollback();
        return res.status(400).json({ error: `Invalid ticket type: ${item.ticket_type_id}` });
      }

      if (!quantity || quantity <= 0) {
        await connection.rollback();
        return res.status(400).json({ error: 'Ticket quantity must be greater than zero.' });
      }

      const remaining = Number(ticket.quantity_available) - Number(ticket.quantity_sold);

      if (quantity > remaining) {
        await connection.rollback();
        return res.status(400).json({
          error: `Not enough available quantity for ${ticket.name}. Remaining: ${remaining}`
        });
      }

      const subtotal = Number(ticket.price) * quantity;
      totalAmount += subtotal;

      bookingItems.push({
        ticket_type_id: ticket.id,
        quantity,
        unit_price: Number(ticket.price),
        subtotal
      });
    }

    const bookingReference = generateBookingReference();

    const [bookingResult] = await connection.query(
      `
      INSERT INTO bookings
      (
        booking_reference,
        user_id,
        event_id,
        booking_status,
        payment_status,
        attendee_name,
        attendee_email,
        attendee_phone,
        total_amount
      )
      VALUES (?, ?, ?, 'pending', 'unpaid', ?, ?, ?, ?)
      `,
      [
        bookingReference,
        req.user.id,
        Number(event_id),
        attendee_name.trim(),
        attendee_email.trim().toLowerCase(),
        attendee_phone || null,
        totalAmount
      ]
    );

    const bookingId = bookingResult.insertId;

    for (const item of bookingItems) {
      await connection.query(
        `
        INSERT INTO booking_items
        (
          booking_id,
          ticket_type_id,
          quantity,
          unit_price,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          bookingId,
          item.ticket_type_id,
          item.quantity,
          item.unit_price,
          item.subtotal
        ]
      );

      await connection.query(
        `
        UPDATE ticket_types
        SET quantity_sold = quantity_sold + ?
        WHERE id = ?
        `,
        [item.quantity, item.ticket_type_id]
      );
    }

    await connection.commit();

    await logActivity({
      user_id: req.user.id,
      action: 'CREATE_BOOKING',
      entity_type: 'booking',
      entity_id: bookingId,
      description: `Booking created with reference ${bookingReference}`,
      req
    });

    await createNotification({
      user_id: req.user.id,
      title: 'Booking Created',
      message: `Your booking ${bookingReference} for "${event.title}" was created successfully.`,
      type: 'success',
      related_type: 'booking',
      related_id: bookingId
    });

    return res.status(201).json({
      message: 'Booking created successfully.',
      booking_id: bookingId,
      booking_reference: bookingReference,
      total_amount: totalAmount
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create booking error:', error);
    return res.status(500).json({ error: 'Server error creating booking.' });
  } finally {
    connection.release();
  }
});

/**
 * CURRENT USER: get my bookings
 */
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const [bookings] = await db.query(
      `
      SELECT
        b.*,
        e.title AS event_title,
        e.start_date,
        e.start_time,
        e.event_image
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.booked_at DESC
      `,
      [req.user.id]
    );

    return res.json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);
    return res.status(500).json({ error: 'Server error fetching bookings.' });
  }
});

/**
 * CURRENT USER: get booking details
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const [bookings] = await db.query(
      `
      SELECT b.*, e.title AS event_title
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.id = ?
      LIMIT 1
      `,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const booking = bookings[0];

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const [items] = await db.query(
      `
      SELECT
        bi.*,
        tt.name AS ticket_name
      FROM booking_items bi
      JOIN ticket_types tt ON bi.ticket_type_id = tt.id
      WHERE bi.booking_id = ?
      `,
      [bookingId]
    );

    return res.json({
      ...booking,
      items
    });
  } catch (error) {
    console.error('Get booking details error:', error);
    return res.status(500).json({ error: 'Server error fetching booking details.' });
  }
});

/**
 * ORGANIZER/ADMIN: get bookings for one event
 */
router.get('/event/:eventId/manage', authMiddleware, roleMiddleware('organizer', 'admin'), async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    const [events] = await db.query(
      `SELECT * FROM events WHERE id = ? LIMIT 1`,
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = events[0];

    if (req.user.role !== 'admin' && event.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied for this event.' });
    }

    const [bookings] = await db.query(
      `
      SELECT
        b.*
      FROM bookings b
      WHERE b.event_id = ?
      ORDER BY b.booked_at DESC
      `,
      [eventId]
    );

    return res.json(bookings);
  } catch (error) {
    console.error('Get event bookings error:', error);
    return res.status(500).json({ error: 'Server error fetching event bookings.' });
  }
});

/**
 * ORGANIZER/ADMIN: check in attendee
 */
router.patch('/:id/check-in', authMiddleware, roleMiddleware('organizer', 'admin'), async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const [bookings] = await db.query(
      `
      SELECT b.*, e.organizer_id
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.id = ?
      LIMIT 1
      `,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const booking = bookings[0];

    if (req.user.role !== 'admin' && booking.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied for this booking.' });
    }

    await db.query(
      `
      UPDATE bookings
      SET booking_status = 'checked_in',
          checked_in_at = NOW()
      WHERE id = ?
      `,
      [bookingId]
    );

    await logActivity({
      user_id: req.user.id,
      action: 'CHECKIN_BOOKING',
      entity_type: 'booking',
      entity_id: bookingId,
      description: `Checked in booking ID ${bookingId}`,
      req
    });

    return res.json({ message: 'Attendee checked in successfully.' });
  } catch (error) {
    console.error('Check-in booking error:', error);
    return res.status(500).json({ error: 'Server error during check-in.' });
  }
});

/**
 * USER/ADMIN: cancel booking
 */
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  const connection = await db.getConnection();

  try {
    const bookingId = Number(req.params.id);
    const { cancellation_reason } = req.body;

    await connection.beginTransaction();

    const [bookings] = await connection.query(
      `
      SELECT *
      FROM bookings
      WHERE id = ?
      LIMIT 1
      `,
      [bookingId]
    );

    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const booking = bookings[0];

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      await connection.rollback();
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (booking.booking_status === 'cancelled') {
      await connection.rollback();
      return res.status(400).json({ error: 'Booking is already cancelled.' });
    }

    const [items] = await connection.query(
      `
      SELECT *
      FROM booking_items
      WHERE booking_id = ?
      `,
      [bookingId]
    );

    for (const item of items) {
      await connection.query(
        `
        UPDATE ticket_types
        SET quantity_sold = quantity_sold - ?
        WHERE id = ?
        `,
        [item.quantity, item.ticket_type_id]
      );
    }

    await connection.query(
      `
      UPDATE bookings
      SET booking_status = 'cancelled',
          cancellation_reason = ?
      WHERE id = ?
      `,
      [cancellation_reason || 'Booking cancelled.', bookingId]
    );

    await connection.commit();

    await logActivity({
      user_id: req.user.id,
      action: 'CANCEL_BOOKING',
      entity_type: 'booking',
      entity_id: bookingId,
      description: `Cancelled booking ID ${bookingId}`,
      req
    });

    await createNotification({
      user_id: booking.user_id,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.booking_reference || bookingId} has been cancelled.`,
      type: 'warning',
      related_type: 'booking',
      related_id: bookingId
    });

    return res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error('Cancel booking error:', error);
    return res.status(500).json({ error: 'Server error cancelling booking.' });
  } finally {
    connection.release();
  }
});

module.exports = router;