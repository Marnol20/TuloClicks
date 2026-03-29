import { MapPin, Building2 } from 'lucide-react'

// Import admin data
import { initialVenues } from './Venues'

function UserViewVenue() {
  return (
    <section className="user-view-venue">
      <div className="section-header">
        <p className="section-label">Location</p>
        <h2 className="section-title">Conference Venues</h2>
      </div>

      <div className="venue-container">
        <div className="venue-info">
          <h3>Philippines Event Venues</h3>
          <p>
            Explore our premier event venues across the Philippines. Each location offers 
            state-of-the-art facilities and excellent accessibility for our conferences and events.
          </p>
          
          {initialVenues.map((venue, index) => (
            <div key={index} className="venue-address" style={{ marginTop: '16px' }}>
              <h4>
                <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
                {venue.name}
              </h4>
              <p>{venue.address}</p>
              <p>{venue.location}</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>
                Capacity: {venue.capacity} | Contact: {venue.contact}
              </p>
            </div>
          ))}
        </div>

        <div className="venue-map">
          <div className="map-placeholder">
            <div className="map-placeholder-icon">🗺️</div>
            <p>Philippines Venues Map</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Locations across the Philippines</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserViewVenue
