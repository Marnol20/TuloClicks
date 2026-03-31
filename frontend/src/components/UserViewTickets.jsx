import { Ticket, Calendar, MapPin } from 'lucide-react'
import { initialVenues } from './Venues'

const ticketsData = [
  {
    id: 1,
    eventName: 'Philippine Music Festival 2026',
    date: 'June 15-17, 2026',
    location: initialVenues[0].location,
    venue: initialVenues[0].name,
    type: 'Full Access Pass',
    status: 'confirmed',
    ticketNumber: 'TC-2026-001',
  },
  {
    id: 2,
    eventName: 'Cebu Business Summit',
    date: 'August 12, 2026',
    location: initialVenues[1].location,
    venue: initialVenues[1].name,
    type: 'Workshop Only',
    status: 'confirmed',
    ticketNumber: 'TC-2026-002',
  },
]

function UserViewTickets() {
  const hasTickets = ticketsData.length > 0

  return (
    <section className="user-view-tickets">
      <div className="section-header">
        <p className="section-label">Tickets</p>
        <h2 className="section-title">My Tickets</h2>
      </div>

      {hasTickets ? (
        <div className="tickets-list">
          {ticketsData.map(function(ticket) {
            return (
              <div className="ticket-card" key={ticket.id}>
                <div className="ticket-info">
                  <h4>{ticket.eventName}</h4>
                  <p>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {ticket.date}
                  </p>
                  <p>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {ticket.venue}
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginLeft: '20px' }}>
                    {ticket.location}
                  </p>
                  <span className="ticket-type">
                    <Ticket size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {ticket.type}
                  </span>
                </div>
                <span className={`ticket-status ${ticket.status}`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🎫</div>
          <h3>No tickets yet</h3>
          <p>Browse our upcoming events and get your tickets!</p>
        </div>
      )}
    </section>
  )
}

export default UserViewTickets
