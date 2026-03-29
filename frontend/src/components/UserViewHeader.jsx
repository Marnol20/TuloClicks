import { Calendar } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function UserViewHeader({ onSwitchToAdmin }) {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    { id: 'home', label: 'HOME', path: '/' },
    { id: 'events', label: 'EVENTS', path: '/events' },
    { id: 'speakers', label: 'SPEAKERS', path: '/speakers' },
    { id: 'venue', label: 'VENUE', path: '/venue' },
    { id: 'tickets', label: 'MY TICKETS', path: '/tickets' },
  ]

  return (
    <header className="user-view-header">
      <div className="user-view-logo">
        <span>ShowFlow</span>
      </div>

      <nav className="user-view-nav">
        {navItems.map(function(item) {
          const isActive = location.pathname === item.path ||
                          (item.id === 'events' && location.pathname.startsWith('/events'))
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`user-view-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="user-view-auth">
        <button className="mode-toggle-btn" onClick={onSwitchToAdmin}>
          Switch to Admin
        </button>
        <button className="user-view-signin" onClick={() => navigate('/login')}>Log In</button>
        <button className="user-view-signup" onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </header>
  )
}

export default UserViewHeader
