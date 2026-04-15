const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const logActivity = require('../utils/logger');
const createNotification = require('../utils/notify');

const router = express.Router();

/**
 * USER / ORGANIZER / ADMIN: create support ticket
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      booking_id,
      event_id,
      subject,
      issue_type,
      description
    } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ error: 'Subject and description are required.' });
    }

    const allowedIssueTypes = ['complaint', 'refund', 'technical', 'other'];

    if (issue_type && !allowedIssueTypes.includes(issue_type)) {
      return res.status(400).json({ error: 'Invalid issue type.' });
    }

    const [result] = await db.query(
      `
      INSERT INTO support_tickets
      (
        user_id,
        booking_id,
        event_id,
        subject,
        issue_type,
        description,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'open')
      `,
      [
        req.user.id,
        booking_id ? Number(booking_id) : null,
        event_id ? Number(event_id) : null,
        subject.trim(),
        issue_type || 'other',
        description.trim()
      ]
    );

    await logActivity({
      user_id: req.user.id,
      action: 'CREATE_SUPPORT',
      entity_type: 'support_ticket',
      entity_id: result.insertId,
      description: `Created support ticket: ${subject.trim()}`,
      req
    });

    await createNotification({
      user_id: req.user.id,
      title: 'Support Ticket Submitted',
      message: `Your support ticket "${subject.trim()}" has been submitted.`,
      type: 'info',
      related_type: 'support_ticket',
      related_id: result.insertId
    });

    return res.status(201).json({
      message: 'Support ticket submitted successfully.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create support ticket error:', error);
    return res.status(500).json({ error: 'Server error creating support ticket.' });
  }
});

/**
 * CURRENT USER: get my support tickets
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [tickets] = await db.query(
      `
      SELECT *
      FROM support_tickets
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.json(tickets);
  } catch (error) {
    console.error('Get my support tickets error:', error);
    return res.status(500).json({ error: 'Server error fetching support tickets.' });
  }
});

/**
 * ADMIN: get all support tickets
 */
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [tickets] = await db.query(
      `
      SELECT
        st.*,
        u.name AS user_name,
        u.email AS user_email
      FROM support_tickets st
      JOIN users u ON st.user_id = u.id
      ORDER BY st.created_at DESC
      `
    );

    return res.json(tickets);
  } catch (error) {
    console.error('Get all support tickets error:', error);
    return res.status(500).json({ error: 'Server error fetching support tickets.' });
  }
});

/**
 * ADMIN: assign and update support ticket status
 */
router.patch('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { status, resolution_notes, assigned_admin_id } = req.body;

    const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];

    const updates = [];
    const values = [];

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid support status.' });
      }
      updates.push('status = ?');
      values.push(status);
    }

    if (resolution_notes !== undefined) {
      updates.push('resolution_notes = ?');
      values.push(resolution_notes ? String(resolution_notes).trim() : null);
    }

    if (assigned_admin_id !== undefined) {
      updates.push('assigned_admin_id = ?');
      values.push(assigned_admin_id ? Number(assigned_admin_id) : null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    const [ticketRows] = await db.query(
      `SELECT * FROM support_tickets WHERE id = ? LIMIT 1`,
      [ticketId]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({ error: 'Support ticket not found.' });
    }

    const ticket = ticketRows[0];

    values.push(ticketId);

    const [result] = await db.query(
      `UPDATE support_tickets SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Support ticket not found.' });
    }

    await logActivity({
      user_id: req.user.id,
      action: status === 'resolved' ? 'RESOLVE_SUPPORT' : 'UPDATE_SUPPORT',
      entity_type: 'support_ticket',
      entity_id: ticketId,
      description: `Updated support ticket ID ${ticketId} to status ${status || 'unchanged'}`,
      req
    });

    if (status === 'resolved') {
      await createNotification({
        user_id: ticket.user_id,
        title: 'Support Ticket Resolved',
        message: `Your support ticket "${ticket.subject}" has been resolved.`,
        type: 'success',
        related_type: 'support_ticket',
        related_id: ticketId
      });
    }

    return res.json({ message: 'Support ticket updated successfully.' });
  } catch (error) {
    console.error('Update support ticket error:', error);
    return res.status(500).json({ error: 'Server error updating support ticket.' });
  }
});

module.exports = router;