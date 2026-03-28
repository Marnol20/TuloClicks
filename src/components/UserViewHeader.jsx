import { Calendar } from 'lucide-react'

function UserViewHeader({ activeTab, setActiveTab, onSwitchToAdmin }) {
  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'events', label: 'EVENTS' },
    { id: 'speakers', label: 'SPEAKERS' },
    { id: 'venue', label: 'VENUE' },
    { id: 'tickets', label: 'MY TICKETS' },
  ]

  return (
    <header className="user-view-header">
      <div className="user-view-logo">
        <div className="user-view-logo-icon">
          <Calendar size={20} />
        </div>
        <span>TechConf26</span>
      </div>

      <nav className="user-view-nav">
        {navItems.map(function(item) {
          return (
            <a
              key={item.id}
              className={`user-view-nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={function() { setActiveTab(item.id) }}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="user-view-auth">
        <button className="mode-toggle-btn" onClick={onSwitchToAdmin}>
          Switch to Admin
        </button>
        <button className="user-view-signin">SIGN IN</button>
        <button className="user-view-signup">Sign Up</button>
      </div>
    </header>
  )
}

export default UserViewHeader
