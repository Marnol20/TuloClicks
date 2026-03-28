import '../styles/Sidebar.css'
import { LayoutDashboard, CalendarDays, Mic2, Users, MapPin } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Events', icon: CalendarDays, path: '/events' },
  { label: 'Speakers', icon: Mic2, path: '/speakers' },
  { label: 'Attendees', icon: Users, path: '/attendees' },
  { label: 'Venues', icon: MapPin, path: '/venues' },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <h1>EventHub</h1>
        <p>Conference Management</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(function(item) {
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.label}
              className={isActive ? 'nav-btn active' : 'nav-btn'}
              onClick={function() { navigate(item.path) }}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-version">
        <p>v1.0.0 • Demo</p>
      </div>

    </aside>
  )
}

export default Sidebar