import '../styles/Attendees.css'
import { Users, Plus, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'

function Attendees() {
  const [searchParams] = useSearchParams()
  const eventFilter = searchParams.get('event')

  const [attendees, setAttendees] = useState([])
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState(eventFilter || '')
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [eventId, setEventId] = useState('')
  const [ticketType, setTicketType] = useState('Standard')

  useEffect(() => {
    fetchAttendees()
    fetchEvents()
  }, [])

  function fetchAttendees() {
    axios.get('http://localhost:5000/api/attendees')
      .then((res) => {
        setAttendees(res.data)
      })
      .catch((err) => {
        console.error('Error fetching attendees:', err)
      })
  }

  function fetchEvents() {
    axios.get('http://localhost:5000/api/events')
      .then((res) => {
        setEvents(res.data)
      })
      .catch((err) => {
        console.error('Error fetching events:', err)
      })
  }

  const filtered = attendees.filter((a) => {
    const q = search.toLowerCase()
    return (
      (a.name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.event || '').toLowerCase().includes(q)
    )
  })

  function handleCreate() {
    if (!name || !email || !eventId) {
      alert('Please fill in all required fields')
      return
    }

    axios.post('http://localhost:5000/api/attendees', {
      name,
      email,
      phone,
      ticket_type: ticketType,
      event_id: eventId
    })
      .then(() => {
        fetchAttendees()
        setShowForm(false)
        setName('')
        setEmail('')
        setPhone('')
        setEventId('')
        setTicketType('Standard')
      })
      .catch((err) => {
        alert(err.response?.data?.error || 'Failed to register attendee')
      })
  }

  function handleCancel() {
    setShowForm(false)
    setName('')
    setEmail('')
    setPhone('')
    setEventId('')
    setTicketType('Standard')
  }

  return (
    <main className="attendees-page">
      <div className="attendees-top">
        <div className="attendees-title">
          <Users size={28} color="#60a5fa" />
          <div>
            <h2>Attendees Management</h2>
            <p>View and manage event attendees</p>
          </div>
        </div>
        <button className="register-btn" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Register Attendee
        </button>
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Register New Attendee</h3>
          <div className="form-grid">
            <input className="form-input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="form-input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select className="form-input" value={eventId} onChange={(e) => setEventId(e.target.value)}>
              <option value="">Select Event</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>{evt.name}</option>
              ))}
            </select>
            <select className="form-input" value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
              <option value="Student">Student</option>
            </select>
          </div>
          <div className="form-buttons">
            <button className="create-btn" onClick={handleCreate}>Register</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="search-bar">
        <Search size={16} color="#64748b" />
        <input
          className="search-input"
          placeholder="Search by name, email, or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="attendees-table">
        <div className="table-header">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Event</span>
          <span>Ticket Type</span>
          <span>Registration Date</span>
        </div>

        {filtered.map((a) => (
          <div key={a.id} className="table-row">
            <span className="row-name">{a.name}</span>
            <span className="row-muted">{a.email}</span>
            <span className="row-muted">{a.phone}</span>
            <Link to="/events" className="row-event-link">{a.event}</Link>
            <span className="row-muted">{a.ticket_type}</span>
            <span className="row-muted">{a.registration_date}</span>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Attendees