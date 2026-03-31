import { useNavigate } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import '../styles/UserView.css'
import UserViewHeader from './UserViewHeader'
import UserViewHero from './UserViewHero'
import UserViewEvents from './UserViewEvents'
import UserViewSpeakers from './UserViewSpeakers'
import UserViewVenue from './UserViewVenue'
import UserViewTickets from './UserViewTickets'
import EventDetails from './EventDetails'
import { initialEvents } from './Events'

function UserView() {
  const navigate = useNavigate()

  const handleEventClick = function(eventId) {
    const eventIndex = parseInt(eventId) - 1
    if (eventIndex >= 0 && eventIndex < initialEvents.length) {
      navigate(`/home/events/${eventId}`)
    }
  }

  const handleBackToEvents = function() {
    navigate('/home/events')
  }

  return (
    <div className="user-view">
      <UserViewHeader />
      <main className="user-view-content">
        <Routes>
          <Route
            index
            element={
              <>
                <UserViewHero />
                <UserViewEvents onEventClick={handleEventClick} />
                <UserViewSpeakers />
              </>
            }
          />
          <Route path="events" element={<UserViewEvents onEventClick={handleEventClick} />} />
          <Route path="events/:eventId" element={<EventDetails onBack={handleBackToEvents} />} />
          <Route path="speakers" element={<UserViewSpeakers />} />
          <Route path="venue" element={<UserViewVenue />} />
          <Route path="tickets" element={<UserViewTickets />} />
        </Routes>
      </main>
    </div>
  )
}

export default UserView