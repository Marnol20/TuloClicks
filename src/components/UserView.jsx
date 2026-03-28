import { useState } from 'react'
import '../styles/UserView.css'
import UserViewHeader from './UserViewHeader'
import UserViewHero from './UserViewHero'
import UserViewEvents from './UserViewEvents'
import UserViewSpeakers from './UserViewSpeakers'
import UserViewVenue from './UserViewVenue'
import UserViewTickets from './UserViewTickets'
import EventDetails from './EventDetails'

function UserView({ onSwitchToAdmin }) {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedEventId, setSelectedEventId] = useState(null)

  const handleEventClick = function(eventId) {
    setSelectedEventId(eventId)
  }

  const handleBackToEvents = function() {
    setSelectedEventId(null)
    setActiveTab('events')
  }

  const renderContent = function() {
    if (selectedEventId) {
      return <EventDetails onBack={handleBackToEvents} selectedEventId={selectedEventId} />
    }

    switch (activeTab) {
      case 'home':
        return (
          <>
            <UserViewHero onViewEvents={function() { setActiveTab('events') }} />
            <UserViewEvents onEventClick={handleEventClick} />
            <UserViewSpeakers />
          </>
        )
      case 'events':
        return <UserViewEvents onEventClick={handleEventClick} />
      case 'speakers':
        return <UserViewSpeakers />
      case 'venue':
        return <UserViewVenue />
      case 'tickets':
        return <UserViewTickets />
      default:
        return (
          <>
            <UserViewHero onViewEvents={function() { setActiveTab('events') }} />
            <UserViewEvents onEventClick={handleEventClick} />
            <UserViewSpeakers />
          </>
        )
    }
  }

  return (
    <div className="user-view">
      <UserViewHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onSwitchToAdmin={onSwitchToAdmin}
      />
      <main className="user-view-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default UserView
