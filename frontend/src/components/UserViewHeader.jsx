import { Link, useLocation, useNavigate } from 'react-router-dom'

function UserViewHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    { id: 'home', label: 'HOME', path: '/home' },
    { id: 'events', label: 'EVENTS', path: '/home/events' },
    { id: 'speakers', label: 'SPEAKERS', path: '/home/speakers' },
    { id: 'venue', label: 'VENUE', path: '/home/venue' },
    { id: 'tickets', label: 'MY TICKETS', path: '/home/tickets' },
  ]

  function handleLogout() {
    const ok = window.confirm('Are you sure you want to logout?')
    if (!ok) return

    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="user-view-header">
      <div className="user-view-logo">
        <span>ShowFlow</span>
      </div>

      <nav className="user-view-nav">
        {navItems.map(function(item) {
          const isActive =
            location.pathname === item.path ||
            (item.id === 'events' && location.pathname.startsWith('/home/events'))

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

        <button
          className="user-view-signin"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default UserViewHeader