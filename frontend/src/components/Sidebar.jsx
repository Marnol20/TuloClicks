import '../styles/Sidebar.css'
import { LayoutDashboard, CalendarDays, Mic2, Users, MapPin, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    const confirmLogout = window.confirm('Are you sure you want to logout?')

    if (!confirmLogout) {
      return
    }

    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <h2>ShowFlow</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/events" className="sidebar-link">
            <CalendarDays size={18} />
            <span>Events</span>
          </NavLink>

          <NavLink to="/speakers" className="sidebar-link">
            <Mic2 size={18} />
            <span>Speakers</span>
          </NavLink>

          <NavLink to="/attendees" className="sidebar-link">
            <Users size={18} />
            <span>Attendees</span>
          </NavLink>

          <NavLink to="/venues" className="sidebar-link">
            <MapPin size={18} />
            <span>Venues</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <p className="sidebar-version">v1.0.0 - Demo</p>
      </div>
    </aside>
  )
}

export default Sidebar