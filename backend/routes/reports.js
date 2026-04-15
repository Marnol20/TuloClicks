const express = require('express')
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/admin/summary', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const [
      [usersRows],
      [organizersRows],
      [eventsRows],
      [bookingsRows],
      [paymentsRows],
      [supportRows],
      [topEventsRows],
      [paymentsByStatusRows]
    ] = await Promise.all([

      db.query(`SELECT COUNT(*) AS total_users FROM users`),

      db.query(`SELECT COUNT(*) AS total_organizers FROM organizer_profiles`),

      db.query(`
        SELECT
          COUNT(*) AS total_events,
          SUM(CASE WHEN approval_status = 'approved' THEN 1 ELSE 0 END) AS approved_events,
          SUM(CASE WHEN approval_status = 'pending' THEN 1 ELSE 0 END) AS pending_events,
          SUM(CASE WHEN approval_status = 'rejected' THEN 1 ELSE 0 END) AS rejected_events
        FROM events
      `),

      db.query(`
        SELECT
          COUNT(*) AS total_bookings,
          SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_bookings,
          SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_bookings,
          SUM(CASE WHEN booking_status = 'checked_in' THEN 1 ELSE 0 END) AS checked_in_bookings
        FROM bookings
      `),

      db.query(`
        SELECT
          COUNT(*) AS total_payments,
          COALESCE(SUM(CASE WHEN payment_status = 'success' THEN amount ELSE 0 END), 0) AS total_revenue,
          SUM(CASE WHEN payment_status = 'success' THEN 1 ELSE 0 END) AS successful_payments,
          SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) AS pending_payments,
          SUM(CASE WHEN payment_status = 'failed' THEN 1 ELSE 0 END) AS failed_payments,
          SUM(CASE WHEN payment_status = 'refunded' THEN 1 ELSE 0 END) AS refunded_payments
        FROM payments
      `),

      db.query(`
        SELECT
          COUNT(*) AS total_support,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_support,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_support
        FROM support_tickets
      `),

      db.query(`
        SELECT
          e.id,
          e.title,
          COUNT(bi.id) AS booking_count,
          COALESCE(SUM(bi.subtotal), 0) AS booking_revenue
        FROM events e
        LEFT JOIN ticket_types tt ON e.id = tt.event_id
        LEFT JOIN booking_items bi ON tt.id = bi.ticket_type_id
        GROUP BY e.id, e.title
        ORDER BY booking_count DESC, booking_revenue DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
          payment_status,
          COUNT(*) AS total
        FROM payments
        GROUP BY payment_status
      `)
    ])

    res.json({
      users: usersRows[0],
      organizers: organizersRows[0],
      events: eventsRows[0],
      bookings: bookingsRows[0],
      payments: paymentsRows[0],
      support: supportRows[0],
      top_events: topEventsRows,
      payment_status_breakdown: paymentsByStatusRows
    })

  } catch (error) {
    console.error('REPORT ERROR:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router