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
  { name: 'John Doe', email: 'john@example.com', event: 'React Conference 2024' },
  { name: 'Jane Smith', email: 'jane@example.com', event: 'React Conference 2024' },
  { name: 'David Kim', email: 'david@example.com', event: 'React Conference 2024' },
  { name: 'Alex Johnson', email: 'alex@example.com', event: 'Web Development Summit' },
  { name: 'Maria Garcia', email: 'maria@example.com', event: 'AI & ML Workshop' },
  { name: 'Sarah Williams', email: 'sarah@example.com', event: 'Frontend Masters Bootcamp' },
]

function getAttendeeCount(eventName) {
  return initialAttendees.filter(a => a.event === eventName).length
}

const eventsData = [
  {
    name: 'React Conference 2024',
    date: 'June 15-17, 2024',
    location: 'Pasay City, Metro Manila',
    status: 'Confirmed',
  },
  {
    name: 'Web Development Summit',
    date: 'July 8-9, 2024',
    location: 'Pasay City, Metro Manila',
    status: 'Planning',
  },
  {
    name: 'AI & ML Workshop',
    date: 'August 12, 2024',
    location: 'Pasay City, Metro Manila',
    status: 'Confirmed',
  },
  {
    name: 'Frontend Masters Bootcamp',
    date: 'September 20-22, 2024',
    location: 'Mandaue City, Cebu',
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
        <div className="auth-buttons">
          <button className="mode-switch-btn" onClick={onSwitchToUser}>Switch to User View</button>
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
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