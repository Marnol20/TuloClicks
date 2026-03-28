import '../styles/Attendees.css'
import { Users, Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const initialAttendees = [
  { name: 'John Doe', email: 'john@example.com', event: 'React Conference 2024', ticketType: 'Standard', registrationDate: '2024-03-15' },
  { name: 'Jane Smith', email: 'jane@example.com', event: 'React Conference 2024', ticketType: 'VIP', registrationDate: '2024-03-14' },
  { name: 'Alex Johnson', email: 'alex@example.com', event: 'Web Development Summit', ticketType: 'Standard', registrationDate: '2024-03-18' },
  { name: 'Maria Garcia', email: 'maria@example.com', event: 'AI & ML Workshop', ticketType: 'VIP', registrationDate: '2024-03-10' },
  { name: 'David Kim', email: 'david@example.com', event: 'React Conference 2024', ticketType: 'Student', registrationDate: '2024-03-16' },
  { name: 'Sarah Williams', email: 'sarah@example.com', event: 'Frontend Masters Bootcamp', ticketType: 'Standard', registrationDate: '2024-03-12' },
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

  const [editingEmail, setEditingEmail] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editEvent, setEditEvent] = useState('')
  const [editTicketType, setEditTicketType] = useState('Standard')

  const [viewingAttendee, setViewingAttendee] = useState(null)

  const filtered = attendees.filter(function (a) {
    const q = search.toLowerCase()
    const matchesSearch = (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.event.toLowerCase().includes(q)
    )
    return matchesSearch
  })

  function handleCreate() {
    if (name === '' || email === '' || event === '') {
      alert('Please fill in all fields')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const newAttendee = { name, email, event, ticketType, registrationDate: today }
    setAttendees([...attendees, newAttendee])
    setShowForm(false)
    setName('')
    setEmail('')
    setEvent('')
    setTicketType('Standard')
  }

  function handleCancel() {
    setShowForm(false)
    setName('')
    setEmail('')
    setEvent('')
    setTicketType('Standard')
  }

  function handleDelete(email) {
    setAttendees(attendees.filter(function (a) { return a.email !== email }))
  }

  function handleEdit(attendee) {
    setEditingEmail(attendee.email)
    setEditName(attendee.name)
    setEditEmail(attendee.email)
    setEditEvent(attendee.event)
    setEditTicketType(attendee.ticketType)
  }

  function handleSaveEdit() {
    setAttendees(attendees.map(function (a) {
      if (a.email === editingEmail) {
        return {
          ...a,
          name: editName,
          email: editEmail,
          event: editEvent,
          ticketType: editTicketType,
        }
      }
      return a
    }))
    setEditingEmail(null)
  }

  function handleCancelEdit() {
    setEditingEmail(null)
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
              <option value="React Conference 2024">React Conference 2024</option>
              <option value="Web Development Summit">Web Development Summit</option>
              <option value="AI & ML Workshop">AI & ML Workshop</option>
              <option value="Frontend Masters Bootcamp">Frontend Masters Bootcamp</option>
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
          let ticketClass = 'ticket-standard'
          if (a.ticketType === 'VIP') ticketClass = 'ticket-vip'
          if (a.ticketType === 'Student') ticketClass = 'ticket-student'

          const isEditing = editingEmail === a.email

          return (
            <div key={a.email} className="table-row">
              {isEditing ? (
                <>
                  <input className="form-input edit-input" value={editName} onChange={function (e) { setEditName(e.target.value) }} />
                  <input className="form-input edit-input" value={editEmail} onChange={function (e) { setEditEmail(e.target.value) }} />
                  <select className="form-input edit-input" value={editEvent} onChange={function (e) { setEditEvent(e.target.value) }}>
                    <option value="React Conference 2024">React Conference 2024</option>
                    <option value="Web Development Summit">Web Development Summit</option>
                    <option value="AI & ML Workshop">AI & ML Workshop</option>
                    <option value="Frontend Masters Bootcamp">Frontend Masters Bootcamp</option>
                  </select>
                  <select className="form-input edit-input" value={editTicketType} onChange={function (e) { setEditTicketType(e.target.value) }}>
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                    <option value="Student">Student</option>
                  </select>
                  <span className="row-muted">{a.registrationDate}</span>
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
                  <span className={ticketClass}>{a.ticketType}</span>
                  <span className="row-muted">{a.registrationDate}</span>
                  <span className="row-actions">
                    <button className="action-btn view" onClick={function () { handleView(a) }}><Eye size={14} /></button>
                    <button className="action-btn edit" onClick={function () { handleEdit(a) }}><Pencil size={14} /></button>
                    <button className="action-btn delete" onClick={function () { handleDelete(a.email) }}><Trash2 size={14} /></button>
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
              <p><strong>Ticket Type:</strong> {viewingAttendee.ticketType}</p>
              <p><strong>Registration Date:</strong> {viewingAttendee.registrationDate}</p>
            </div>
            <button className="close-btn" onClick={handleCloseView}>Close</button>
          </div>
        </div>
      )}

    </main>
  )
}

export default Attendees