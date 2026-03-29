import '../styles/Attendees.css'
import { Users, Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000/api/attendees'

const initialAttendees = [
  { id: 1, name: 'Juan Santos', email: 'juan@example.com', event: 'Philippine Music Festival 2026', event_id: 1, ticketType: 'Standard', ticket_type: 'Standard', registrationDate: '2026-03-15', registration_date: '2026-03-15' },
  { id: 2, name: 'Maria Reyes', email: 'maria@example.com', event: 'Philippine Music Festival 2026', event_id: 1, ticketType: 'VIP', ticket_type: 'VIP', registrationDate: '2026-03-14', registration_date: '2026-03-14' },
  { id: 3, name: 'Ana Garcia', email: 'ana@example.com', event: 'Manila Tech Conference', event_id: 2, ticketType: 'Standard', ticket_type: 'Standard', registrationDate: '2026-03-18', registration_date: '2026-03-18' },
  { id: 4, name: 'Carlos Villanueva', email: 'carlos@example.com', event: 'Cebu Business Summit', event_id: 3, ticketType: 'VIP', ticket_type: 'VIP', registrationDate: '2026-03-10', registration_date: '2026-03-10' },
  { id: 5, name: 'Pedro Cruz', email: 'pedro@example.com', event: 'Philippine Music Festival 2026', event_id: 1, ticketType: 'Student', ticket_type: 'Student', registrationDate: '2026-03-16', registration_date: '2026-03-16' },
  { id: 6, name: 'Elena Mendoza', email: 'elena@example.com', event: 'Davao Food Festival', event_id: 4, ticketType: 'Standard', ticket_type: 'Standard', registrationDate: '2026-03-12', registration_date: '2026-03-12' },
]

function Attendees() {
  const [searchParams] = useSearchParams()
  const eventFilter = searchParams.get('event')

  const [attendees, setAttendees] = useState(initialAttendees)
  const [search, setSearch] = useState(eventFilter || '')
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [event, setEvent] = useState('')
  const [ticketType, setTicketType] = useState('Standard')

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editEvent, setEditEvent] = useState('')
  const [editTicketType, setEditTicketType] = useState('Standard')

  const [viewingAttendee, setViewingAttendee] = useState(null)

  useEffect(function () {
    loadAttendees()
  }, [])

  async function loadAttendees() {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) {
        throw new Error('Failed to fetch attendees')
      }
      const data = await res.json()
      setAttendees(data)
    } catch (error) {
      console.error('Load attendees error:', error)
    }
  }

  const filtered = attendees.filter(function (a) {
    const q = search.toLowerCase()
    const attendeeEvent = (a.event || '').toLowerCase()
    const matchesSearch = (
      (a.name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      attendeeEvent.includes(q)
    )
    return matchesSearch
  })

  async function handleCreate() {
    if (name === '' || email === '' || event === '') {
      alert('Please fill in all fields')
      return
    }

    const payload = {
      name: name,
      email: email,
      event_id: Number(event),
      ticket_type: ticketType,
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to register attendee')
        return
      }

      setShowForm(false)
      setName('')
      setEmail('')
      setEvent('')
      setTicketType('Standard')
      loadAttendees()
    } catch (error) {
      console.error('Create attendee error:', error)
      alert('Server error while creating attendee')
    }
  }

  function handleCancel() {
    setShowForm(false)
    setName('')
    setEmail('')
    setEvent('')
    setTicketType('Standard')
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this attendee?')
    if (!confirmed) return

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to delete attendee')
        return
      }

      loadAttendees()
    } catch (error) {
      console.error('Delete attendee error:', error)
      alert('Server error while deleting attendee')
    }
  }

  function handleEdit(attendee) {
    setEditingId(attendee.id)
    setEditName(attendee.name || '')
    setEditEmail(attendee.email || '')
    setEditEvent(String(attendee.event_id || ''))
    setEditTicketType(attendee.ticket_type || attendee.ticketType || 'Standard')
  }

  async function handleSaveEdit() {
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          event_id: Number(editEvent),
          ticket_type: editTicketType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to update attendee')
        return
      }

      setEditingId(null)
      loadAttendees()
    } catch (error) {
      console.error('Update attendee error:', error)
      alert('Server error while updating attendee')
    }
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  function handleView(attendee) {
    setViewingAttendee(attendee)
  }

  function handleCloseView() {
    setViewingAttendee(null)
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
        <button className="register-btn" onClick={function () { setShowForm(true) }}>
          <Plus size={16} />
          Register Attendee
        </button>
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Register New Attendee</h3>
          <div className="form-grid">
            <input className="form-input" placeholder="Full Name" value={name} onChange={function (e) { setName(e.target.value) }} />
            <input className="form-input" placeholder="Email" value={email} onChange={function (e) { setEmail(e.target.value) }} />
            <select className="form-input" value={event} onChange={function (e) { setEvent(e.target.value) }}>
              <option value="">Select Event</option>
              <option value="1">Philippine Music Festival 2026</option>
              <option value="2">Manila Tech Conference</option>
              <option value="3">Cebu Business Summit</option>
              <option value="4">Davao Food Festival</option>
            </select>
            <select className="form-input" value={ticketType} onChange={function (e) { setTicketType(e.target.value) }}>
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
          onChange={function (e) { setSearch(e.target.value) }}
        />
      </div>

      <div className="attendees-table">
        <div className="table-header">
          <span>Name</span>
          <span>Email</span>
          <span>Event</span>
          <span>Ticket Type</span>
          <span>Registration Date</span>
          <span>Actions</span>
        </div>

        {filtered.map(function (a) {
          const currentTicketType = a.ticket_type || a.ticketType || 'Standard'
          const currentRegistrationDate = a.registration_date || a.registrationDate || ''
          let ticketClass = 'ticket-standard'
          if (currentTicketType === 'VIP') ticketClass = 'ticket-vip'
          if (currentTicketType === 'Student') ticketClass = 'ticket-student'

          const isEditing = editingId === a.id

          return (
            <div key={a.id || a.email} className="table-row">
              {isEditing ? (
                <>
                  <input className="form-input edit-input" value={editName} onChange={function (e) { setEditName(e.target.value) }} />
                  <input className="form-input edit-input" value={editEmail} onChange={function (e) { setEditEmail(e.target.value) }} />
                  <select className="form-input edit-input" value={editEvent} onChange={function (e) { setEditEvent(e.target.value) }}>
                    <option value="1">Philippine Music Festival 2026</option>
                    <option value="2">Manila Tech Conference</option>
                    <option value="3">Cebu Business Summit</option>
                    <option value="4">Davao Food Festival</option>
                  </select>
                  <select className="form-input edit-input" value={editTicketType} onChange={function (e) { setEditTicketType(e.target.value) }}>
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                    <option value="Student">Student</option>
                  </select>
                  <span className="row-muted">{currentRegistrationDate}</span>
                  <span className="row-actions">
                    <button className="action-btn save" onClick={handleSaveEdit}>✓</button>
                    <button className="action-btn cancel" onClick={handleCancelEdit}>✕</button>
                  </span>
                </>
              ) : (
                <>
                  <span className="row-name">{a.name}</span>
                  <span className="row-muted">{a.email}</span>
                  <Link to="/events" className="row-event-link">{a.event}</Link>
                  <span className={ticketClass}>{currentTicketType}</span>
                  <span className="row-muted">{currentRegistrationDate}</span>
                  <span className="row-actions">
                    <button className="action-btn view" onClick={function () { handleView(a) }}><Eye size={14} /></button>
                    <button className="action-btn edit" onClick={function () { handleEdit(a) }}><Pencil size={14} /></button>
                    <button className="action-btn delete" onClick={function () { handleDelete(a.id) }}><Trash2 size={14} /></button>
                  </span>
                </>
              )}
            </div>
          )
        })}
      </div>

      {viewingAttendee && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content" onClick={function (e) { e.stopPropagation() }}>
            <h3>Attendee Details</h3>
            <div className="modal-body">
              <p><strong>Name:</strong> {viewingAttendee.name}</p>
              <p><strong>Email:</strong> {viewingAttendee.email}</p>
              <p><strong>Event:</strong> {viewingAttendee.event}</p>
              <p><strong>Ticket Type:</strong> {viewingAttendee.ticket_type || viewingAttendee.ticketType}</p>
              <p><strong>Registration Date:</strong> {viewingAttendee.registration_date || viewingAttendee.registrationDate}</p>
            </div>
            <button className="close-btn" onClick={handleCloseView}>Close</button>
          </div>
        </div>
      )}

    </main>
  )
}

export default Attendees