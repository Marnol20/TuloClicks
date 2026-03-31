import '../styles/Events.css'
import { CalendarDays, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Events() {
  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [venueId, setVenueId] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Planning')

  useEffect(() => {
    fetchEvents()
    fetchVenues()
  }, [])

  function fetchEvents() {
    axios.get('http://localhost:5000/api/events')
      .then((res) => {
        setEvents(res.data)
      })
      .catch((err) => {
        console.error('Fetch events error:', err)
      })
  }

  function fetchVenues() {
    axios.get('http://localhost:5000/api/venues')
      .then((res) => {
        console.log('Venues from DB:', res.data)
        setVenues(res.data)
      })
      .catch((err) => {
        console.error('Fetch venues error:', err)
      })
  }

  function getAttendeeCount(eventId) {
    return 0
  }

  function handleCreate() {
    const cleanTitle = title.trim()
    const cleanDate = date.trim()
    const cleanLocation = location.trim()
    const cleanDescription = description.trim()
    const cleanVenueId = String(venueId).trim()

    const missingFields = []

    if (!cleanTitle) missingFields.push('Event Title')
    if (!cleanDate) missingFields.push('Date')
    if (!cleanLocation) missingFields.push('Location')
    if (!cleanVenueId) missingFields.push('Venue')

    console.log('Create event values:', {
      title: cleanTitle,
      date: cleanDate,
      location: cleanLocation,
      venueId: cleanVenueId,
      description: cleanDescription,
      status
    })

    if (missingFields.length > 0) {
      alert(`Please fill in these fields: ${missingFields.join(', ')}`)
      return
    }

    axios.post('http://localhost:5000/api/events', {
      name: cleanTitle,
      date: cleanDate,
      location: cleanLocation,
      venue_id: Number(cleanVenueId),
      description: cleanDescription,
      status
    })
      .then(() => {
        fetchEvents()
        setShowForm(false)
        setTitle('')
        setDate('')
        setLocation('')
        setVenueId('')
        setDescription('')
        setStatus('Planning')
      })
      .catch((err) => {
        console.error('Create event error:', err)
        console.error('Response data:', err.response?.data)
        alert(err.response?.data?.error || 'Failed to create event')
      })
  }

  function handleCancel() {
    setShowForm(false)
    setTitle('')
    setDate('')
    setLocation('')
    setVenueId('')
    setDescription('')
    setStatus('Planning')
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
        <button className="new-event-btn" onClick={() => setShowForm(true)}>
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
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="form-input"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              className="form-input"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select
              className="form-input"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
            >
              <option value="">Select Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={String(venue.id)}>
                  {venue.name}
                </option>
              ))}
            </select>

            <input
              className="form-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planning">Planning</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
            Loaded Venues: {venues.length} | Selected Venue ID: {venueId || 'None'}
          </div>

          <div className="form-buttons">
            <button className="create-btn" onClick={handleCreate}>
              Create Event
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="events-list">
        {events.map((event) => {
          let badgeClass = 'badge'

          if (event.status === 'Confirmed') badgeClass = 'badge confirmed'
          else if (event.status === 'Planning') badgeClass = 'badge planning'
          else if (event.status === 'Cancelled') badgeClass = 'badge cancelled'

          return (
            <div key={event.id} className="event-card">
              <div className="event-card-top">
                <div>
                  <h3>{event.name}</h3>
                  <p className="event-description">
                    {event.description || 'No description'}
                  </p>
                </div>
                <span className={badgeClass}>
                  {event.status || 'Planning'}
                </span>
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
                  <span className="info-value">
                    {event.venue || 'No venue assigned'}
                  </span>
                </div>

                <div className="info-block">
                  <span className="info-label">Attendees</span>
                  <Link
                    to={`/attendees?event=${encodeURIComponent(event.name)}`}
                    className="info-value attendee-link"
                  >
                    {getAttendeeCount(event.id)}
                  </Link>
                </div>

                <div className="info-block">
                  <span className="info-label">Speakers</span>
                  <span className="info-value">
                    {event.speakers && event.speakers.length > 0
                      ? event.speakers.join(', ')
                      : 'No speakers yet'}
                  </span>
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
export const initialEvents = []