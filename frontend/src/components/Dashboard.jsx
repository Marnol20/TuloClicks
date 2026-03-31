import '../styles/Dashboard.css'
import { CalendarDays, Mic2, Users, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from './StatCard'
import EventItem from './EventItem'

function Dashboard({ onSwitchToUser }) {
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [attendees, setAttendees] = useState([])
  const [venues, setVenues] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const [eventsRes, speakersRes, attendeesRes, venuesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events'),
        axios.get('http://localhost:5000/api/speakers'),
        axios.get('http://localhost:5000/api/attendees'),
        axios.get('http://localhost:5000/api/venues')
      ])

      setEvents(eventsRes.data || [])
      setSpeakers(speakersRes.data || [])
      setAttendees(attendeesRes.data || [])
      setVenues(venuesRes.data || [])
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }
  }

  function getAttendeeCount(eventName) {
    return attendees.filter((a) => a.event === eventName).length
  }

  const stats = [
    {
      label: 'Total Events',
      value: String(events.length),
      icon: CalendarDays,
      iconColor: '#60a5fa'
    },
    {
      label: 'Active Speakers',
      value: String(speakers.length),
      icon: Mic2,
      iconColor: '#c084fc'
    },
    {
      label: 'Total Attendees',
      value: String(attendees.length),
      icon: Users,
      iconColor: '#22d3ee'
    },
    {
      label: 'Venues',
      value: String(venues.length),
      icon: MapPin,
      iconColor: '#facc15'
    }
  ]

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Welcome Back</h2>
          <p>Here's an overview of your events and management metrics</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="events-section">
        <div className="events-section-header">
          <h3>Upcoming Events</h3>
          <button className="view-all-btn" onClick={() => navigate('/events')}>
            View All
          </button>
        </div>

        <div className="events-list">
          {events.length > 0 ? (
            events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="event-item-clickable"
                onClick={() => navigate('/events')}
                style={{ cursor: 'pointer' }}
              >
                <EventItem
                  name={event.name}
                  date={event.date}
                  location={event.location}
                  attendees={getAttendeeCount(event.name)}
                  status={event.status || 'Planning'}
                />
              </div>
            ))
          ) : (
            <p style={{ color: '#94a3b8' }}>No events found.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default Dashboard