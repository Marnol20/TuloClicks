import '../styles/Dashboard.css'
import { CalendarDays, Mic2, Users, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from './StatCard'
import EventItem from './EventItem'

const stats = [
  { label: 'Total Events', value: '24', icon: CalendarDays, iconColor: '#60a5fa' },
  { label: 'Active Speakers', value: '156', icon: Mic2, iconColor: '#c084fc' },
  { label: 'Total Attendees', value: '2,847', icon: Users, iconColor: '#22d3ee' },
  { label: 'Venues', value: '12', icon: MapPin, iconColor: '#facc15' },
]

const initialAttendees = [
  { name: 'Juan Santos', email: 'juan@example.com', event: 'Philippine Music Festival 2026' },
  { name: 'Maria Reyes', email: 'maria@example.com', event: 'Philippine Music Festival 2026' },
  { name: 'Pedro Cruz', email: 'pedro@example.com', event: 'Philippine Music Festival 2026' },
  { name: 'Ana Garcia', email: 'ana@example.com', event: 'Manila Tech Conference' },
  { name: 'Carlos Villanueva', email: 'carlos@example.com', event: 'Cebu Business Summit' },
  { name: 'Elena Mendoza', email: 'elena@example.com', event: 'Davao Food Festival' },
]

function getAttendeeCount(eventName) {
  return initialAttendees.filter(a => a.event === eventName).length
}

const eventsData = [
  {
    name: 'Philippine Music Festival 2026',
    date: 'June 15-17, 2026',
    location: 'Pasay City, Metro Manila',
    status: 'Confirmed',
  },
  {
    name: 'Manila Tech Conference',
    date: 'July 8-9, 2026',
    location: 'Pasay City, Metro Manila',
    status: 'Planning',
  },
  {
    name: 'Cebu Business Summit',
    date: 'August 12, 2026',
    location: 'Mandaue City, Cebu',
    status: 'Confirmed',
  },
  {
    name: 'Davao Food Festival',
    date: 'September 20-22, 2026',
    location: 'Davao City',
    status: 'Planning',
  },
]

function Dashboard({ onSwitchToUser }) {
  const navigate = useNavigate()

  return (
    <main className="dashboard">

      <div className="dashboard-header">
        <div>
          <h2>Welcome Back</h2>
          <p>Here's an overview of your events and management metrics</p>
        </div>
        <button className="mode-switch-btn" onClick={onSwitchToUser}>Switch to User View</button>
      </div>

      <div className="stats-grid">
        {stats.map(function(stat) {
          return (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
            />
          )
        })}
      </div>

      <div className="events-section">

        <div className="events-section-header">
          <h3>Upcoming Events</h3>
          <button className="view-all-btn" onClick={() => navigate('/events')}>View All</button>
        </div>

        <div className="events-list">
          {eventsData.slice(0, 3).map(function(event) {
            return (
              <div key={event.name} className="event-item-clickable" onClick={() => navigate('/events')}>
                <EventItem
                  name={event.name}
                  date={event.date}
                  location={event.location}
                  attendees={getAttendeeCount(event.name)}
                  status={event.status}
                />
              </div>
            )
          })}
        </div>

      </div>

    </main>
  )
}

export default Dashboard