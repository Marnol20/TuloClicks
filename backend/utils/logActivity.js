const db = require('../db')

async function logActivity({
  userId = null,
  action = '',
  entityType = null,
  entityId = null,
  description = '',
  ipAddress = null
}) {
  try {
    await db.query(
      `
      INSERT INTO activity_logs
      (user_id, action, entity_type, entity_id, description, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [userId, action, entityType, entityId, description, ipAddress]
    )
  } catch (error) {
    console.error('Activity log error:', error.message)
  }
}

module.exports = logActivity