import { useEffect, useState } from 'react'
import '../../styles/Attendees.css'
import api from '../../services/api'

function ActivityLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      setLoading(true)
      const res = await api.get('/activity-logs/admin/all')
      setLogs(res.data || [])
    } catch (error) {
      console.error('Fetch activity logs error:', error)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  function formatDate(date) {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  return (
    <main className="attendees-page">
      <div className="attendees-top">
        <div className="attendees-title">
          <div>
            <h2>Activity Logs</h2>
            <p>Monitor important actions performed in the system</p>
          </div>
        </div>
      </div>

      <div className="attendees-table">
        <div
          className="table-header"
          style={{ gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1.4fr' }}
        >
          <span>User</span>
          <span>Action</span>
          <span>Entity</span>
          <span>Description</span>
          <span>IP</span>
          <span>Date</span>
        </div>

        {loading ? (
          <div className="table-empty">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="table-empty">No activity logs found.</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="table-row"
              style={{ gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr 1.4fr' }}
            >
              <span className="row-name">{log.user_name || 'System'}</span>
              <span className="row-muted">{log.action || 'N/A'}</span>
              <span className="row-muted">
                {log.entity_type ? `${log.entity_type}${log.entity_id ? ` #${log.entity_id}` : ''}` : 'N/A'}
              </span>
              <span className="row-muted">{log.description || 'No description'}</span>
              <span className="row-muted">{log.ip_address || 'N/A'}</span>
              <span className="row-muted">{formatDate(log.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

export default ActivityLogs