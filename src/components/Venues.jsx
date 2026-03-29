import '../styles/Venues.css'
import { MapPin, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const initialVenues = [
  {
    name: 'SMX Convention Center Manila',
    address: 'Seashell Ln, Mall of Asia Complex, Pasay City',
    location: 'Pasay City, Metro Manila',
    country: 'Philippines',
    capacity: '5,000',
    eventsHosted: 12,
    contact: '+63 (2) 8950-8000',
  },
  {
    name: 'Philippine International Convention Center',
    address: 'CCP Complex, Roxas Boulevard, Pasay City',
    location: 'Pasay City, Metro Manila',
    country: 'Philippines',
    capacity: '8,000',
    eventsHosted: 18,
    contact: '+63 (2) 8832-3000',
  },
  {
    name: 'World Trade Center Metro Manila',
    address: '2/F WTCMM Building, 1300 Pasay City',
    location: 'Pasay City, Metro Manila',
    country: 'Philippines',
    capacity: '3,500',
    eventsHosted: 8,
    contact: '+63 (2) 8851-3000',
  },
  {
    name: 'Cebu International Convention Center',
    address: 'Mandaue City, Cebu',
    location: 'Mandaue City, Cebu',
    country: 'Philippines',
    capacity: '6,200',
    eventsHosted: 15,
    contact: '+63 (32) 345-6789',
  },
]

function Venues() {
  const [venues, setVenues] = useState(initialVenues)
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState('')
  const [country, setCountry] = useState('Philippines')
  const [capacity, setCapacity] = useState('')
  const [contact, setContact] = useState('')

  useEffect(function () {
    fetchVenues()
  }, [])

  function fetchVenues() {
    axios.get('http://localhost:5000/api/venues')
      .then(function (res) {
        const formattedVenues = res.data.map(function (venue) {
          return {
            ...venue,
            capacity: Number(venue.capacity).toLocaleString(),
            eventsHosted: venue.eventsHosted || 0,
          }
        })
        setVenues(formattedVenues)
      })
      .catch(function (err) {
        console.error('Error fetching venues:', err)
      })
  }

  function handleCreate() {
  if (name === '' || address === '' || location === '' || country === '' || capacity === '' || contact === '') {
    alert('Please fill in all fields')
    return
  }

  const cleanCapacity = capacity.toString().replace(/[^\d]/g, '')

  if (cleanCapacity === '') {
    alert('Capacity must be a number')
    return
  }

  const newVenue = {
    name,
    address,
    location,
    country,
    capacity: Number(cleanCapacity),
    contact,
  }

  axios.post('http://localhost:5000/api/venues', newVenue)
    .then(function () {
      fetchVenues()
      setShowForm(false)
      setName('')
      setAddress('')
      setLocation('')
      setCountry('Philippines')
      setCapacity('')
      setContact('')
    })
    .catch(function (err) {
      console.error('Error creating venue:', err)
      alert(err.response?.data?.error || 'Failed to create venue')
    })
}

  function handleCancel() {
    setShowForm(false)
    setName('')
    setAddress('')
    setLocation('')
    setCountry('Philippines')
    setCapacity('')
    setContact('')
  }

  return (
    <main className="venues-page">

      <div className="venues-top">
        <div className="venues-title">
          <MapPin size={28} color="#facc15" />
          <div>
            <h2>Philippines Venues</h2>
            <p>Manage event venues and locations in the Philippines</p>
          </div>
        </div>
        <button className="add-venue-btn" onClick={function () { setShowForm(true) }}>
          <Plus size={16} />
          Add Venue
        </button>
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Add New Philippines Venue</h3>
          <div className="form-grid">
            <input className="form-input" placeholder="Venue Name" value={name} onChange={function (e) { setName(e.target.value) }} />
            <input className="form-input" placeholder="Full Address (Philippines)" value={address} onChange={function (e) { setAddress(e.target.value) }} />
            <input className="form-input" placeholder="City, Province (e.g. Pasay City, Metro Manila)" value={location} onChange={function (e) { setLocation(e.target.value) }} />
            <input className="form-input" value={country} readOnly />
            <input className="form-input" placeholder="Capacity" value={capacity} onChange={function (e) { setCapacity(e.target.value) }} />
            <input className="form-input" placeholder="Contact Phone (+63)" value={contact} onChange={function (e) { setContact(e.target.value) }} />
          </div>
          <div className="form-buttons">
            <button className="create-btn" onClick={handleCreate}>Add Venue</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="venues-list">
        {venues.map(function (venue) {
          return (
            <div key={venue.id || venue.name} className="venue-card">

              <div className="venue-card-top">
                <h3>{venue.name}</h3>
                <p className="venue-address">{venue.address}</p>
              </div>

              <div className="venue-card-info">
                <div className="info-block">
                  <span className="info-label">Location</span>
                  <span className="info-value">{venue.location}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">Country</span>
                  <span className="info-value">{venue.country}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">Capacity</span>
                  <span className="info-value">{venue.capacity}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">Events Hosted</span>
                  <span className="info-value">{venue.eventsHosted}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">Contact</span>
                  <span className="info-value contact-blue">{venue.contact}</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </main>
  )
}

export default Venues

// Export data for user view
export { initialVenues }