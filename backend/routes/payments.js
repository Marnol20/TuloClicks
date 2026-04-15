const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const logActivity = require('../utils/logger');
const createNotification = require('../utils/notify');

const router = express.Router();

/**
 * USER/ADMIN: create payment record for a booking
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      booking_id,
      provider,
      payment_method,
      payment_reference,
      amount
    } = req.body;

    if (!booking_id || !amount) {
      return res.status(400).json({ error: 'Booking and amount are required.' });
    }

    const [bookings] = await db.query(
      `
      SELECT *
      FROM bookings
      WHERE id = ?
      LIMIT 1
      `,
      [Number(booking_id)]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const booking = bookings[0];

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const [result] = await db.query(
      `
      INSERT INTO payments
      (
        booking_id,
        payment_reference,
        provider,
        payment_method,
        amount,
        currency,
        payment_status
      )
      VALUES (?, ?, ?, ?, ?, 'PHP', 'pending')
      `,
      [
        Number(booking_id),
        payment_reference || null,
        provider || null,
        payment_method || null,
        Number(amount)
      ]
    );

    await logActivity({
      user_id: req.user.id,
      action: 'CREATE_PAYMENT',
      entity_type: 'payment',
      entity_id: result.insertId,
      description: `Created payment for booking ID ${booking_id}`,
      req
    });

    await createNotification({
      user_id: booking.user_id,
      title: 'Payment Record Created',
      message: `A payment record was created for your booking ${booking.booking_reference || booking_id}.`,
      type: 'info',
      related_type: 'payment',
      related_id: result.insertId
    });

    return res.status(201).json({
      message: 'Payment record created successfully.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({ error: 'Server error creating payment record.' });
  }
});

/**
 * CURRENT USER / ADMIN: get payments for one booking
 */
router.get('/booking/:bookingId', authMiddleware, async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const [bookings] = await db.query(
      `SELECT * FROM bookings WHERE id = ? LIMIT 1`,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const booking = bookings[0];

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const [payments] = await db.query(
      `
      SELECT *
      FROM payments
      WHERE booking_id = ?
      ORDER BY created_at DESC
      `,
      [bookingId]
    );

    return res.json(payments);
  } catch (error) {
    console.error('Get booking payments error:', error);
    return res.status(500).json({ error: 'Server error fetching payment records.' });
  }
});

/**
 * ADMIN: get all payments
 */
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [payments] = await db.query(
      `
      SELECT
        p.*,
        b.booking_reference,
        b.attendee_name,
        b.attendee_email,
        e.title AS event_title
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      ORDER BY p.created_at DESC
      `
    );

    return res.json(payments);
  } catch (error) {
    console.error('Get all payments error:', error);
    return res.status(500).json({ error: 'Server error fetching payments.' });
  }
});

/**
 * ADMIN: mark payment success
 */
router.patch('/:id/success', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const connection = await db.getConnection();

  try {
    const paymentId = Number(req.params.id);

    await connection.beginTransaction();

    const [payments] = await connection.query(
      `SELECT * FROM payments WHERE id = ? LIMIT 1`,
      [paymentId]
    );

    if (payments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Payment not found.' });
    }

    const payment = payments[0];

    const [bookingRows] = await connection.query(
      `SELECT * FROM bookings WHERE id = ? LIMIT 1`,
      [payment.booking_id]
    );

    if (bookingRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found for payment.' });
    }

    const booking = bookingRows[0];

    await connection.query(
      `
      UPDATE payments
      SET payment_status = 'success',
          paid_at = NOW()
      WHERE id = ?
      `,
      [paymentId]
    );

    await connection.query(
      `
      UPDATE bookings
      SET payment_status = 'paid',
          booking_status = 'confirmed'
      WHERE id = ?
      `,
      [payment.booking_id]
    );

    await connection.commit();

    await logActivity({
      user_id: req.user.id,
      action: 'PAYMENT_SUCCESS',
      entity_type: 'payment',
      entity_id: paymentId,
      description: `Marked payment ID ${paymentId} as successful`,
      req
    });

    await createNotification({
      user_id: booking.user_id,
      title: 'Payment Successful',
      message: `Your payment for booking ${booking.booking_reference || booking.id} was marked successful.`,
      type: 'success',
      related_type: 'payment',
      related_id: paymentId
    });

    return res.json({ message: 'Payment marked as successful.' });
  } catch (error) {
    await connection.rollback();
    console.error('Mark payment success error:', error);
    return res.status(500).json({ error: 'Server error updating payment.' });
  } finally {
    connection.release();
  }
});

/**
 * ADMIN: mark payment failed
 */
router.patch('/:id/fail', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const paymentId = Number(req.params.id);

    const [payments] = await db.query(
      `SELECT * FROM payments WHERE id = ? LIMIT 1`,
      [paymentId]
    );

    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    const payment = payments[0];

    const [bookingRows] = await db.query(
      `SELECT * FROM bookings WHERE id = ? LIMIT 1`,
      [payment.booking_id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ error: 'Booking not found for payment.' });
    }

    const booking = bookingRows[0];

    await db.query(
      `
      UPDATE payments
      SET payment_status = 'failed'
      WHERE id = ?
      `,
      [paymentId]
    );

    await db.query(
      `
      UPDATE bookings
      SET payment_status = 'failed'
      WHERE id = ?
      `,
      [payment.booking_id]
    );

    await logActivity({
      user_id: req.user.id,
      action: 'PAYMENT_FAILED',
      entity_type: 'payment',
      entity_id: paymentId,
      description: `Marked payment ID ${paymentId} as failed`,
      req
    });

    await createNotification({
      user_id: booking.user_id,
      title: 'Payment Failed',
      message: `Your payment for booking ${booking.booking_reference || booking.id} failed.`,
      type: 'error',
      related_type: 'payment',
      related_id: paymentId
    });

    return res.json({ message: 'Payment marked as failed.' });
  } catch (error) {
    console.error('Mark payment fail error:', error);
    return res.status(500).json({ error: 'Server error updating payment.' });
  }
});

/**
 * ADMIN: refund payment
 */
router.patch('/:id/refund', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const connection = await db.getConnection();

  try {
    const paymentId = Number(req.params.id);
    const { refund_amount, refund_reason } = req.body;

    await connection.beginTransaction();

    const [payments] = await connection.query(
      `SELECT * FROM payments WHERE id = ? LIMIT 1`,
      [paymentId]
    );

    if (payments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Payment not found.' });
    }

    const payment = payments[0];

    const [bookingRows] = await connection.query(
      `SELECT * FROM bookings WHERE id = ? LIMIT 1`,
      [payment.booking_id]
    );

    if (bookingRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found for payment.' });
    }

    const booking = bookingRows[0];

    const amountToRefund = refund_amount !== undefined ? Number(refund_amount) : Number(payment.amount);

    await connection.query(
      `
      UPDATE payments
      SET payment_status = 'refunded',
          refund_amount = ?,
          refund_reason = ?
      WHERE id = ?
      `,
      [amountToRefund, refund_reason || 'Refund processed.', paymentId]
    );

    await connection.query(
      `
      UPDATE bookings
      SET payment_status = 'refunded',
          booking_status = 'refunded'
      WHERE id = ?
      `,
      [payment.booking_id]
    );

    await connection.commit();

    await logActivity({
      user_id: req.user.id,
      action: 'REFUND_PAYMENT',
      entity_type: 'payment',
      entity_id: paymentId,
      description: `Refunded payment ID ${paymentId}`,
      req
    });

    await createNotification({
      user_id: booking.user_id,
      title: 'Payment Refunded',
      message: `Your payment for booking ${booking.booking_reference || booking.id} has been refunded.`,
      type: 'info',
      related_type: 'payment',
      related_id: paymentId
    });

    return res.json({ message: 'Payment refunded successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error('Refund payment error:', error);
    return res.status(500).json({ error: 'Server error refunding payment.' });
  } finally {
    connection.release();
  }
});

module.exports = router;