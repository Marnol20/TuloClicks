import '../styles/EventItem.css'
import { MapPin, Users } from 'lucide-react'

function EventItem(props) {
  let badgeClass = 'badge'

  if (props.status === 'Confirmed') {
    badgeClass = 'badge confirmed'
  } else if (props.status === 'Planning') {
    badgeClass = 'badge planning'
  } else if (props.status === 'Cancelled') {
    badgeClass = 'badge cancelled'
  }

  return (
    <div className="event-item">

      <div>
        <h3 className="event-name">{props.name}</h3>
        <p className="event-date">{props.date}</p>

        <div className="event-meta">
          <span>
            <MapPin size={12} color="#f87171" />
            {props.location}
          </span>
          <span>
            <Users size={12} />
            {props.attendees} attendees
          </span>
        </div>
      </div>

      <span className={badgeClass}>
        {props.status}
      </span>

    </div>
  )
}

export default EventItem