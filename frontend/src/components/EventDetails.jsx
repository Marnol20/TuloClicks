import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, Calendar, ChevronLeft, Share2, Download, ExternalLink } from 'lucide-react'
import '../styles/EventDetails.css'

// Import admin data
import { initialEvents } from './Events'
import { initialSpeakers } from './Speakers'

function EventDetails({ onBack }) {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationStep, setRegistrationStep] = useState(1) // 1: Select Tickets, 2: Review Order
  const [selectedTickets, setSelectedTickets] = useState({})
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Get the selected event data based on URL param
  const eventIndex = parseInt(eventId) - 1
  const selectedEvent = (eventIndex >= 0 && eventIndex < initialEvents.length)
    ? initialEvents[eventIndex]
    : initialEvents[0]
  const eventSpeaker = initialSpeakers.find(s => s.event === selectedEvent.name) || initialSpeakers[0]

  // Ticket types for the event
  const ticketTypes = [
    { id: 'standard', name: 'Standard Pass', price: 5499, description: 'Access to all sessions' },
    { id: 'vip', name: 'VIP Pass', price: 10999, description: 'Priority seating + networking lunch' },
    { id: 'premium', name: 'Premium Pass', price: 16499, description: 'All access + workshop materials' },
  ]

  const handleTicketChange = (ticketId, quantity) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: quantity
    }))
  }

  const getTotalAmount = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = ticketTypes.find(t => t.id === ticketId)
      return total + (ticket ? ticket.price * quantity : 0)
    }, 0)
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)
  }

  const handleContinueToReview = () => {
    if (getTotalTickets() === 0) {
      alert('Please select at least one ticket')
      return
    }
    if (!termsAccepted) {
      alert('Please accept the terms and conditions')
      return
    }
    setRegistrationStep(2)
  }

  const handleConfirmRegistration = () => {
    setIsRegistered(true)
    setRegistrationStep(1)
  }

  const handleBackToSelection = () => {
    setRegistrationStep(1)
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
        <button className="back-btn" onClick={() => navigate('/events')}>
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
                  <>
                    {registrationStep === 1 ? (
                      <div className="ticket-selection">
                        <h4>Select Tickets</h4>
                        <div className="ticket-types">
                          {ticketTypes.map(ticket => (
                            <div key={ticket.id} className="ticket-type-item">
                              <div className="ticket-type-info">
                                <span className="ticket-type-name">{ticket.name}</span>
                                <span className="ticket-type-price">₱{ticket.price.toLocaleString()}</span>
                              </div>
                              <p className="ticket-type-description">{ticket.description}</p>
                              <div className="ticket-quantity">
                                <button 
                                  className="quantity-btn"
                                  onClick={() => handleTicketChange(ticket.id, Math.max(0, (selectedTickets[ticket.id] || 0) - 1))}
                                >
                                  -
                                </button>
                                <span className="quantity-value">{selectedTickets[ticket.id] || 0}</span>
                                <button 
                                  className="quantity-btn"
                                  onClick={() => handleTicketChange(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="terms-checkbox">
                          <label>
                            <input 
                              type="checkbox" 
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <span>I agree to the Terms and Conditions</span>
                          </label>
                        </div>
                        
                        <button 
                          className="continue-btn"
                          onClick={handleContinueToReview}
                          disabled={getTotalTickets() === 0 || !termsAccepted}
                        >
                          Continue to Review
                        </button>
                      </div>
                    ) : (
                      <div className="order-review">
                        <h4>Review Order</h4>
                        <div className="order-summary">
                          <div className="order-header">
                            <span>Item</span>
                            <span>Qty</span>
                            <span>Price</span>
                          </div>
                          {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                            if (quantity === 0) return null
                            const ticket = ticketTypes.find(t => t.id === ticketId)
                            return (
                              <div key={ticketId} className="order-item">
                                <span>{ticket.name}</span>
                                <span>{quantity}</span>
                                <span>₱{(ticket.price * quantity).toLocaleString()}</span>
                              </div>
                            )
                          })}
                          <div className="order-total">
                            <span>Total</span>
                            <span>₱{getTotalAmount().toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="order-actions">
                          <button className="back-btn" onClick={handleBackToSelection}>
                            Back
                          </button>
                          <button className="confirm-btn" onClick={handleConfirmRegistration}>
                            Confirm Registration
                          </button>
                        </div>
                      </div>
                    )}
                  </>
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