import { useState } from 'react'
import { MapPin, Clock, Users, Sparkles, Calendar, ChevronRight } from 'lucide-react'

// Import admin data
import Events from './Events'
import { initialEvents } from './Events'

const eventsData = initialEvents.map((event, index) => ({
  id: index + 1,
  title: event.name,
  day: 'DAY 1', // Could be derived from date
  date: event.date,
  time: '9:00 AM - 5:00 PM', // Default time
  location: event.venue,
  type: 'Session', // Could be derived from event type
  description: event.description || 'Join us for this exciting event.',
  speaker: event.speakers && event.speakers.length > 0 ? event.speakers[0] : null,
}))

const filterTabs = ['All', 'Session', 'Workshop', 'Panel', 'Break', 'Social']

function UserViewEvents({ onEventClick }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredEvents = activeFilter === 'All' 
    ? eventsData 
    : eventsData.filter(event => event.type === activeFilter)

  return (
    <div className="user-view-events-page">
      {/* Page Header */}
      <div className="events-page-header">
        <h1>Events</h1>
        <p>Three days of inspiring talks, hands-on workshops, and networking opportunities. Discover all upcoming events at TechConf 2026.</p>
      </div>

      {/* Upcoming Events Section */}
      <div className="upcoming-events-section">
        <div className="section-header-row">
          <div className="section-title-group">
            <div className="section-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h2>Upcoming Events</h2>
              <p>Don't miss these highlighted sessions</p>
            </div>
          </div>
          <a href="#" className="view-schedule-link">
            View Full Schedule
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Event Cards Grid */}
        <div className="events-grid-new">
          {filteredEvents.slice(0, 4).map(function(event) {
            return (
              <div className="event-card-new" key={event.id} onClick={() => onEventClick(event.id)}>
                <div className="event-card-header">
                  <span className="event-day">DAY 1 - {event.date}</span>
                  <span className={`event-badge ${event.type.toLowerCase()}`}>{event.type}</span>
                </div>
                <h3 className="event-title-new">{event.title}</h3>
                <p className="event-description-new">{event.description}</p>
                <div className="event-meta">
                  <span className="event-meta-item">
                    <Clock size={14} />
                    9:00 AM - 5:00 PM
                  </span>
                  <span className="event-meta-item">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                </div>
                {event.speaker && (
                  <div className="event-speaker">
                    <Users size={14} />
                    <span>{event.speaker}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Events Banner */}
      <div className="today-events-banner">
        <div className="today-events-info">
          <div className="today-icon">
            <Calendar size={24} />
          </div>
          <div>
            <h3>Today's Events</h3>
            <p>September 15, 2026 - 12 sessions scheduled</p>
          </div>
        </div>
        <button className="view-today-btn">View Today's Schedule</button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-container">
        {filterTabs.map(function(tab) {
          return (
            <button
              key={tab}
              className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
              onClick={function() { setActiveFilter(tab) }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Filtered Events List */}
      <div className="filtered-events-list">
        {filteredEvents.map(function(event) {
          return (
              <div className="event-list-item" key={event.id} onClick={() => onEventClick(event.id)}>
                <div className="event-list-header">
                  <span className="event-list-day">DAY 1 - {event.date}</span>
                  <span className={`event-badge ${event.type.toLowerCase()}`}>{event.type}</span>
                </div>
                <h3 className="event-list-title">{event.title}</h3>
                <p className="event-list-description">{event.description}</p>
                <div className="event-list-meta">
                  <span className="event-meta-item">
                    <Clock size={14} />
                    9:00 AM - 5:00 PM
                  </span>
                  <span className="event-meta-item">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                  {event.speaker && (
                    <span className="event-meta-item">
                      <Users size={14} />
                      {event.speaker}
                    </span>
                  )}
                </div>
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserViewEvents
