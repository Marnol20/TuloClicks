import '../styles/Events.css'
import { CalendarDays, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const initialAttendees = [
  { name: 'Juan Santos', email: 'juan@example.com', company: 'Tech Solutions Inc', event: 'Philippine Music Festival 2026', ticketType: 'Standard', status: 'Confirmed' },
  { name: 'Maria Reyes', email: 'maria@example.com', company: 'Digital Innovations', event: 'Philippine Music Festival 2026', ticketType: 'VIP', status: 'Confirmed' },
  { name: 'Pedro Cruz', email: 'pedro@example.com', company: 'Student at University of the Philippines', event: 'Philippine Music Festival 2026', ticketType: 'Student', status: 'Confirmed' },
  { name: 'Ana Garcia', email: 'ana@example.com', company: 'Startup Labs', event: 'Manila Tech Conference', ticketType: 'Standard', status: 'Pending' },
  { name: 'Carlos Villanueva', email: 'carlos@example.com', company: 'Enterprise Systems', event: 'Cebu Business Summit', ticketType: 'VIP', status: 'Confirmed' },
  { name: 'Elena Mendoza', email: 'elena@example.com', company: 'Creative Agency', event: 'Davao Food Festival', ticketType: 'Standard', status: 'Confirmed' },
]

const venuesData = [
  { name: 'SMX Convention Center Manila', address: 'Seashell Ln, Mall of Asia Complex, Pasay City', location: 'Pasay City, Metro Manila' },
  { name: 'Philippine International Convention Center', address: 'CCP Complex, Roxas Boulevard, Pasay City', location: 'Pasay City, Metro Manila' },
  { name: 'World Trade Center Metro Manila', address: '2/F WTCMM Building, 1300 Pasay City', location: 'Pasay City, Metro Manila' },
  { name: 'Cebu International Convention Center', address: 'Mandaue City, Cebu', location: 'Mandaue City, Cebu' },
]

const initialEvents = [
  {
    name: 'Philippine Music Festival 2026',
    description: 'Annual celebration of Filipino music featuring top local and international artists',
    date: 'June 15-17, 2026',
    location: 'Pasay City, Metro Manila',
    venue: 'SMX Convention Center Manila',
    speakers: ['Maria Santos', 'Juan dela Cruz', 'Ana Reyes'],
    status: 'Confirmed',
  },
  {
    name: 'Manila Tech Conference',
    description: 'Premier technology conference showcasing innovation and digital transformation',
    date: 'July 8-9, 2026',
    location: 'Pasay City, Metro Manila',
    venue: 'Philippine International Convention Center',
    speakers: ['Carlos Garcia', 'Elena Villanueva'],
    status: 'Planning',
  },
  {
    name: 'Cebu Business Summit',
    description: 'Leading business and entrepreneurship summit in the Visayas region',
    date: 'August 12, 2026',
    location: 'Mandaue City, Cebu',
    venue: 'Cebu International Convention Center',
    speakers: ['Roberto Tan', 'Isabella Cruz'],
    status: 'Confirmed',
  },
  {
    name: 'Davao Food Festival',
    description: 'Culinary celebration featuring Mindanao\'s finest dishes and local delicacies',
    date: 'September 20-22, 2026',
    location: 'Davao City',
    venue: 'SMX Convention Center Davao',
    speakers: ['Miguel Santos', 'Sofia Reyes', 'Diego Mendoza'],
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

  useEffect(function () {
    fetchEvents()
  }, [])

  function fetchEvents() {
    axios.get('http://localhost:5000/api/events')
      .then(function (res) {
        const formattedEvents = res.data.map(function (event) {
          return {
            ...event,
            description: event.description || '',
            speakers: Array.isArray(event.speakers) ? event.speakers : [],
            status: event.status || 'Planning',
          }
        })
        setEvents(formattedEvents)
      })
.catch(function (err) {
  console.error('Create event error:', err)
  console.error('Response data:', err.response?.data)
  alert(err.response?.data?.error || err.message || 'Failed to create event')
})
  }

  function handleCreate() {
    if (title === '' || date === '' || location === '' || venue === '') {
      alert('Please fill in all fields')
      return
    }

    axios.post('http://localhost:5000/api/events', {
      name: title,
      date: date,
      location: location,
      venue: venue,
    })
      .then(function () {
        fetchEvents()
        setShowForm(false)
        setTitle('')
        setDate('')
        setLocation('')
        setVenue('')
      })
      .catch(function (err) {
  console.error('Create event error:', err)
  console.error('Response data:', err.response?.data)
  alert(err.response?.data?.error || err.message || 'Failed to create event')
})
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
            <div key={event.id || event.name} className="event-card">

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