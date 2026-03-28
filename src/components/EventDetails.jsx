import { useState } from 'react'
import { MapPin, Clock, Users, Calendar, ChevronLeft, Share2, Download, ExternalLink } from 'lucide-react'
import '../styles/EventDetails.css'

// Import admin data
import { initialEvents } from './Events'
import { initialSpeakers } from './Speakers'

const eventData = initialEvents[0] // Use first event as example
const eventSpeaker = initialSpeakers.find(s => s.event === eventData.name) || initialSpeakers[0]

function EventDetails({ onBack, selectedEventId }) {
  const [isRegistered, setIsRegistered] = useState(false)

  // Get the selected event data based on ID
  const selectedEvent = initialEvents.find(event => event.name === selectedEventId) || initialEvents[0]
  const eventSpeaker = initialSpeakers.find(s => s.event === selectedEvent.name) || initialSpeakers[0]

  const handleRegister = () => {
    setIsRegistered(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedEvent.name,
        text: selectedEvent.description,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="event-details-page">
      {/* Header */}
      <div className="event-details-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={20} />
          Back to Events
        </button>
        <div className="event-actions">
          <button className="share-btn" onClick={handleShare}>
            <Share2 size={16} />
            Share
          </button>
          <button className="download-btn">
            <Download size={16} />
            Download Agenda
          </button>
        </div>
      </div>

      {/* Event Hero */}
      <div className="event-hero">
        <div className="event-hero-content">
          <div className="event-meta-header">
            <span className="event-day">DAY 1 - {selectedEvent.date}</span>
            <span className={`event-type-badge session`}>
              Session
            </span>
          </div>
          <h1 className="event-title">{selectedEvent.name}</h1>
          <p className="event-description">{selectedEvent.description}</p>
          
          <div className="event-details-info">
            <div className="detail-item">
              <Clock size={16} />
              <span>9:00 AM - 5:00 PM</span>
            </div>
            <div className="detail-item">
              <MapPin size={16} />
              <span>{selectedEvent.venue}</span>
            </div>
            <div className="detail-item">
              <Calendar size={16} />
              <span>{selectedEvent.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="event-details-content">
        <div className="content-grid">
          {/* Left Column */}
          <div className="main-content">
            {/* Speaker Section */}
            <div className="speaker-section">
              <h2>About the Speaker</h2>
              <div className="speaker-card">
                <div className="speaker-avatar">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt={eventSpeaker.name} />
                </div>
                <div className="speaker-info">
                  <h3>{eventSpeaker.name}</h3>
                  <p className="speaker-role">{eventSpeaker.role}</p>
                  <p className="speaker-company">TechCorp</p>
                  <p className="speaker-bio">{eventSpeaker.name} is a passionate speaker with extensive experience in their field.</p>
                </div>
              </div>
            </div>

            {/* Agenda Section */}
            <div className="agenda-section">
              <h2>Session Agenda</h2>
              <div className="agenda-timeline">
                <div className="agenda-item">
                  <div className="agenda-time">10:30 AM</div>
                  <div className="agenda-content">
                    <div className="agenda-dot"></div>
                    <div className="agenda-title">Current State of Web Development</div>
                  </div>
                </div>
                <div className="agenda-item">
                  <div className="agenda-time">10:45 AM</div>
                  <div className="agenda-content">
                    <div className="agenda-dot"></div>
                    <div className="agenda-title">Performance Trends and Benchmarks</div>
                  </div>
                </div>
                <div className="agenda-item">
                  <div className="agenda-time">11:00 AM</div>
                  <div className="agenda-content">
                    <div className="agenda-dot"></div>
                    <div className="agenda-title">Future Technologies and Frameworks</div>
                  </div>
                </div>
                <div className="agenda-item">
                  <div className="agenda-time">11:15 AM</div>
                  <div className="agenda-content">
                    <div className="agenda-dot"></div>
                    <div className="agenda-title">Q&A Session</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Events */}
            <div className="related-events-section">
              <h2>Related Events</h2>
              <div className="related-events-grid">
                {initialEvents.slice(1, 3).map((event, index) => (
                  <div key={index} className="related-event-card">
                    <div className="related-event-header">
                      <span className="related-event-day">DAY 1</span>
                      <span className={`related-event-type session`}>
                        Session
                      </span>
                    </div>
                    <h3 className="related-event-title">{event.name}</h3>
                    <p className="related-event-time">9:00 AM - 5:00 PM</p>
                    <p className="related-event-location">{event.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="sidebar-content">
            {/* Registration Section */}
            <div className="registration-section">
              <h3>Event Registration</h3>
              <div className="registration-card">
                <div className="registration-info">
                  <h4>{selectedEvent.name}</h4>
                  <p className="registration-date">{selectedEvent.date}</p>
                  <p className="registration-time">9:00 AM - 5:00 PM</p>
                  <p className="registration-location">{selectedEvent.venue}</p>
                </div>
                
                {!isRegistered ? (
                  <button className="register-btn" onClick={handleRegister}>
                    Register for Event
                  </button>
                ) : (
                  <div className="registration-confirmed">
                    <div className="check-icon">✓</div>
                    <span>Registered</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn">
                  <ExternalLink size={16} />
                  Add to Calendar
                </button>
                <button className="action-btn">
                  <MapPin size={16} />
                  View Venue Map
                </button>
                <button className="action-btn">
                  <Users size={16} />
                  View Attendees
                </button>
              </div>
            </div>

            {/* Event Details */}
            <div className="event-details-sidebar">
              <h3>Event Details</h3>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Event Type</span>
                  <span className="detail-value">Session</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">1 hour</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Capacity</span>
                  <span className="detail-value">200 attendees</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Level</span>
                  <span className="detail-value">All Levels</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails