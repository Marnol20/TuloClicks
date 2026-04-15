import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import '../../styles/Reports.css'
import api from '../../services/api'

function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  async function fetchReports() {
    try {
      setLoading(true)
      const res = await api.get('/reports/admin/summary')
      setData(res.data || {})
    } catch (error) {
      console.error('Fetch reports error:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  function downloadCSV() {
    if (!data) return

    const users = data.users || {}
    const organizers = data.organizers || {}
    const events = data.events || {}
    const bookings = data.bookings || {}
    const payments = data.payments || {}
    const support = data.support || {}
    const topEvents = Array.isArray(data.top_events) ? data.top_events : []
    const paymentBreakdown = Array.isArray(data.payment_status_breakdown)
      ? data.payment_status_breakdown
      : []

    const rows = [
      ['TuloClicks Reports Export'],
      ['Generated At', new Date().toLocaleString()],
      [],
      ['SUMMARY'],
      ['Metric', 'Value'],
      ['Total Users', users.total_users || 0],
      ['Approved Organizers', organizers.total_organizers || 0],
      ['Total Events', events.total_events || 0],
      ['Approved Events', events.approved_events || 0],
      ['Pending Events', events.pending_events || 0],
      ['Rejected Events', events.rejected_events || 0],
      ['Total Bookings', bookings.total_bookings || 0],
      ['Confirmed Bookings', bookings.confirmed_bookings || 0],
      ['Cancelled Bookings', bookings.cancelled_bookings || 0],
      ['Checked In Bookings', bookings.checked_in_bookings || 0],
      ['Total Revenue', payments.total_revenue || 0],
      ['Successful Payments', payments.successful_payments || 0],
      ['Pending Payments', payments.pending_payments || 0],
      ['Failed Payments', payments.failed_payments || 0],
      ['Refunded Payments', payments.refunded_payments || 0],
      ['Open Support Issues', support.open_support || 0],
      ['Resolved Support Issues', support.resolved_support || 0],
      ['Total Support Tickets', support.total_support || 0],
      [],
      ['TOP EVENTS'],
      ['Event Title', 'Bookings', 'Revenue']
    ]

    topEvents.forEach((event) => {
      rows.push([
        event.title || '',
        event.booking_count || 0,
        event.booking_revenue || 0
      ])
    })

    rows.push([])
    rows.push(['PAYMENT STATUS BREAKDOWN'])
    rows.push(['Status', 'Total'])

    paymentBreakdown.forEach((item) => {
      rows.push([
        item.payment_status || '',
        item.total || 0
      ])
    })

    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? '')
            const escaped = value.replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(',')
      )
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `tuloclicks_reports_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <main className="reports-page">
        <div className="reports-empty">Loading reports...</div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="reports-page">
        <div className="reports-empty">Failed to load reports.</div>
      </main>
    )
  }

  const users = data.users || {}
  const organizers = data.organizers || {}
  const events = data.events || {}
  const bookings = data.bookings || {}
  const payments = data.payments || {}
  const support = data.support || {}
  const topEvents = Array.isArray(data.top_events) ? data.top_events : []
  const paymentBreakdown = Array.isArray(data.payment_status_breakdown)
    ? data.payment_status_breakdown
    : []

  const cards = [
    { label: 'Total Users', value: users.total_users || 0 },
    { label: 'Approved Organizers', value: organizers.total_organizers || 0 },
    { label: 'Total Events', value: events.total_events || 0 },
    { label: 'Pending Events', value: events.pending_events || 0 },
    { label: 'Total Bookings', value: bookings.total_bookings || 0 },
    { label: 'Total Revenue', value: `₱${Number(payments.total_revenue || 0).toLocaleString()}` }
  ]

  const bookingChartData = [
    { name: 'Confirmed', total: Number(bookings.confirmed_bookings || 0) },
    { name: 'Cancelled', total: Number(bookings.cancelled_bookings || 0) },
    { name: 'Checked In', total: Number(bookings.checked_in_bookings || 0) }
  ]

  const paymentPieData = paymentBreakdown.map((item) => ({
    name: item.payment_status || 'unknown',
    value: Number(item.total || 0)
  }))

  const topEventsChartData = topEvents.map((event) => ({
    name: event.title?.length > 18 ? `${event.title.slice(0, 18)}...` : (event.title || 'Untitled'),
    bookings: Number(event.booking_count || 0),
    revenue: Number(event.booking_revenue || 0)
  }))

  const pieColors = ['#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#38bdf8', '#f97316']

  return (
    <main className="reports-page">
      <div className="reports-header">
        <div>
          <h2>Reports</h2>
          <p>System-generated summary and database insights</p>
        </div>

        <div className="reports-actions">
          <button className="reports-export-btn" onClick={downloadCSV}>
            Export CSV
          </button>
          <button className="reports-refresh-btn" onClick={fetchReports}>
            Refresh
          </button>
        </div>
      </div>

      <section className="reports-cards">
        {cards.map((card) => (
          <div key={card.label} className="report-card">
            <p className="report-card-label">{card.label}</p>
            <h3 className="report-card-value">{card.value}</h3>
          </div>
        ))}
      </section>

      <section className="reports-grid">
        <div className="reports-panel chart-panel">
          <h3>Booking Status Chart</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={bookingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273244" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #273244',
                    borderRadius: '12px',
                    color: '#f9fafb'
                  }}
                />
                <Bar dataKey="total" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="reports-panel chart-panel">
          <h3>Payment Status Breakdown</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={paymentPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {paymentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #273244',
                    borderRadius: '12px',
                    color: '#f9fafb'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="reports-grid">
        <div className="reports-panel chart-panel full-span">
          <h3>Top Events by Bookings</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={topEventsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273244" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #273244',
                    borderRadius: '12px',
                    color: '#f9fafb'
                  }}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="reports-grid">
        <div className="reports-panel">
          <h3>Support Overview</h3>
          <div className="reports-list">
            <div className="reports-row">
              <span>Open Issues</span>
              <strong>{support.open_support || 0}</strong>
            </div>
            <div className="reports-row">
              <span>Resolved Issues</span>
              <strong>{support.resolved_support || 0}</strong>
            </div>
            <div className="reports-row">
              <span>Total Tickets</span>
              <strong>{support.total_support || 0}</strong>
            </div>
          </div>
        </div>

        <div className="reports-panel">
          <h3>Top Events Table</h3>

          {topEvents.length === 0 ? (
            <p className="reports-muted">No event booking data available.</p>
          ) : (
            <div className="reports-table">
              <div className="reports-table-head">
                <span>Event</span>
                <span>Bookings</span>
                <span>Revenue</span>
              </div>

              {topEvents.map((event) => (
                <div key={event.id} className="reports-table-row">
                  <span>{event.title}</span>
                  <span>{event.booking_count}</span>
                  <span>₱{Number(event.booking_revenue || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Reports