import '../styles/Events.css'
import { CalendarDays, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialAttendees = [
  { name: 'John Doe', email: 'john@example.com', company: 'Tech Solutions Inc', event: 'React Conference 2024', ticketType: 'Standard', status: 'Confirmed' },
  { name: 'Jane Smith', email: 'jane@example.com', company: 'Digital Innovations', event: 'React Conference 2024', ticketType: 'VIP', status: 'Confirmed' },
  { name: 'David Kim', email: 'david@example.com', company: 'Student at Tech University', event: 'React Conference 2024', ticketType: 'Student', status: 'Confirmed' },
  { name: 'Alex Johnson', email: 'alex@example.com', company: 'Startup Labs', event: 'Web Development Summit', ticketType: 'Standard', status: 'Pending' },
  { name: 'Maria Garcia', email: 'maria@example.com', company: 'Enterprise Systems', event: 'AI & ML Workshop', ticketType: 'VIP', status: 'Confirmed' },
  { name: 'Sarah Williams', email: 'sarah@example.com', company: 'Creative Agency', event: 'Frontend Masters Bootcamp', ticketType: 'Standard', status: 'Confirmed' },
]

const venuesData = [
  { name: 'SMX Convention Center Manila', address: 'Seashell Ln, Mall of Asia Complex, Pasay City', location: 'Pasay City, Metro Manila' },
  { name: 'Philippine International Convention Center', address: 'CCP Complex, Roxas Boulevard, Pasay City', location: 'Pasay City, Metro Manila' },
  { name: 'World Trade Center Metro Manila', address: '2/F WTCMM Building, 1300 Pasay City', location: 'Pasay City, Metro Manila' },
  { name: 'Cebu International Convention Center', address: 'Mandaue City, Cebu', location: 'Mandaue City, Cebu' },
]

const initialEvents = [
  {
    name: 'React Conference 2024',
    description: 'Annual conference focusing on React ecosystem and best practices',
    date: 'June 15-17, 2024',
    location: 'Pasay City, Metro Manila',
    venue: 'SMX Convention Center Manila',
    speakers: ['Sarah Chen', 'James Wilson', 'Michael Zhang'],
    status: 'Confirmed',
  },
  {
    name: 'Web Development Summit',
    description: 'Comprehensive summit on modern web development',
    date: 'July 8-9, 2024',
    location: 'Pasay City, Metro Manila',
    venue: 'Philippine International Convention Center',
    speakers: ['James Wilson', 'Lisa Thompson'],
    status: 'Planning',
  },
  {
    name: 'AI & ML Workshop',
    description: 'Hands-on workshop for AI and machine learning practitioners',
    date: 'August 12, 2024',
    location: 'Pasay City, Metro Manila',
    venue: 'World Trade Center Metro Manila',
    speakers: ['Emma Rodriguez'],
    status: 'Confirmed',
  },
  {
    name: 'Frontend Masters Bootcamp',
    description: 'Intensive bootcamp for frontend developers',
    date: 'September 20-22, 2024',
    location: 'Mandaue City, Cebu',
    venue: 'Cebu International Convention Center',
    speakers: ['Sarah Chen', 'Lisa Thompson'],
    status: 'Planning',
  },
]

function getAttendeeCount(eventName) {
  return initialAttendees.filter(a => a.event === eventName).length
}

function Events() {
  const [events, setEvents] = useState(initialEvents)
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [venue, setVenue] = useState('')

  function handleCreate() {
    if (title === '' || date === '' || location === '' || venue === '') {
      alert('Please fill in all fields')
      return
    }

    const newEvent = {
      name: title,
      description: '',
      date: date,
      location: location,
      venue: venue,
      speakers: [],
      status: 'Planning',
    }

    setEvents([...events, newEvent])
    setShowForm(false)
    setTitle('')
    setDate('')
    setLocation('')
    setVenue('')
  }

  function handleCancel() {
    setShowForm(false)
    setTitle('')
    setDate('')
    setLocation('')
    setVenue('')
  }

  return (
    <main className="events-page">

      <div className="events-top">
        <div className="events-title">
          <CalendarDays size={28} color="#60a5fa" />
          <div>
            <h2>Events Management</h2>
            <p>Create, manage, and track all your events</p>
          </div>
        </div>
        <button className="new-event-btn" onClick={function() { setShowForm(true) }}>
          <Plus size={16} />
          New Event
        </button>
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Create New Event</h3>
          <div className="form-grid">
            <input
              className="form-input"
              placeholder="Event Title"
              value={title}
              onChange={function(e) { setTitle(e.target.value) }}
            />
            <input
              className="form-input"
              placeholder="Date"
              value={date}
              onChange={function(e) { setDate(e.target.value) }}
            />
            <select
              className="form-input"
              value={location}
              onChange={function(e) {
                setLocation(e.target.value)
                setVenue('')
              }}
            >
              <option value="">Select Location</option>
              {Array.from(new Set(venuesData.map(v => v.location))).map(function(loc) {
                return <option key={loc} value={loc}>{loc}</option>
              })}
            </select>
            <select
              className="form-input"
              value={venue}
              onChange={function(e) { setVenue(e.target.value) }}
              disabled={!location}
            >
              <option value="">{location ? 'Select Venue' : 'Select Location First'}</option>
              {venuesData
                .filter(function(v) { return v.location === location })
                .map(function(v) {
                  return <option key={v.name} value={v.name}>{v.name}</option>
                })}
            </select>
          </div>
          <div className="form-buttons">
            <button className="create-btn" onClick={handleCreate}>Create Event</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="events-list">
        {events.map(function(event) {
          let badgeClass = 'badge'

          if (event.status === 'Confirmed') {
            badgeClass = 'badge confirmed'
          } else if (event.status === 'Planning') {
            badgeClass = 'badge planning'
          }

          return (
            <div key={event.name} className="event-card">

              <div className="event-card-top">
                <div>
                  <h3>{event.name}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
                <span className={badgeClass}>{event.status}</span>
              </div>

              <div className="event-card-info">
                <div className="info-block">
                  <span className="info-label">Date</span>
                  <span className="info-value">{event.date}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">Location</span>
                  <span className="info-value">{event.location}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">Venue</span>
                  <span className="info-value">{event.venue}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">Attendees</span>
                  <Link to={`/attendees?event=${encodeURIComponent(event.name)}`} className="info-value attendee-link">
                    {getAttendeeCount(event.name)}
                  </Link>
                </div>
                <div className="info-block">
                  <span className="info-label">Speakers</span>
                  <span className="info-value">{event.speakers.join(', ')}</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </main>
  )
}

export default Events

// Export data for user view
export { initialEvents }
