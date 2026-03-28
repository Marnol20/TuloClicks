import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import '../styles/UserView.css'
import UserViewHeader from './UserViewHeader'
import UserViewHero from './UserViewHero'
import UserViewEvents from './UserViewEvents'
import UserViewSpeakers from './UserViewSpeakers'
import UserViewVenue from './UserViewVenue'
import UserViewTickets from './UserViewTickets'
import EventDetails from './EventDetails'
import Login from './Login'
import SignUp from './SignUp'

// Import admin data
import { initialEvents } from './Events'

function UserView({ onSwitchToAdmin }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleEventClick = function(eventId) {
    // Find the event object based on the numeric ID
    const eventIndex = parseInt(eventId) - 1
    if (eventIndex >= 0 && eventIndex < initialEvents.length) {
      navigate(`/events/${eventId}`)
    }
  }

  const handleBackToEvents = function() {
    navigate('/events')
  }

  return (
    <div className="user-view">
      <UserViewHeader
        onSwitchToAdmin={onSwitchToAdmin}
      />
      <main className="user-view-content">
        <Routes>
          <Route path="/" element={
            <>
              <UserViewHero />
              <UserViewEvents onEventClick={handleEventClick} />
              <UserViewSpeakers />
            </>
          } />
          <Route path="/events" element={<UserViewEvents onEventClick={handleEventClick} />} />
          <Route path="/events/:eventId" element={<EventDetails onBack={handleBackToEvents} />} />
          <Route path="/speakers" element={<UserViewSpeakers />} />
          <Route path="/venue" element={<UserViewVenue />} />
          <Route path="/tickets" element={<UserViewTickets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
    </div>
  )
}

export default UserView
