import '../styles/Speakers.css'
import { Mic2, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const initialSpeakers = []

function Speakers() {
  const [speakers, setSpeakers] = useState([])
  const [dbEvents, setDbEvents] = useState([])
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [email, setEmail] = useState('')

  const fetchData = async () => {
    try {
      const sRes = await axios.get('http://localhost:5000/api/speakers')
      setSpeakers(sRes.data)

      const eRes = await axios.get('http://localhost:5000/api/events')
      setDbEvents(eRes.data)
    } catch (err) {
      console.error('Fetch error:', err)
      setSpeakers([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleCreate() {
    if (!name || !role || !selectedEvent || !email) {
      alert('Please fill in all fields')
      return
    }

    axios.post('http://localhost:5000/api/speakers', {
      name,
      role,
      email,
      event_id: selectedEvent
    })
      .then(() => {
        fetchData()
        setShowForm(false)
        setName('')
        setRole('')
        setSelectedEvent('')
        setEmail('')
      })
      .catch((err) => {
        alert(err.response?.data?.error || 'Could not save speaker.')
      })
  }

  return (
    <main className="speakers-page">
      <div className="speakers-top">
        <div className="speakers-title">
          <Mic2 size={28} color="#60a5fa" />
          <div>
            <h2>Speakers Management</h2>
            <p>Manage speakers and their event appearances</p>
          </div>
        </div>
        <button className="add-speaker-btn" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Speaker
        </button>
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Add New Speaker</h3>
          <div className="form-grid">
            <input className="form-input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="form-input" placeholder="Role / Title" value={role} onChange={(e) => setRole(e.target.value)} />
            <select className="form-input" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
              <option value="">Select Event</option>
              {dbEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>{evt.name}</option>
              ))}
            </select>
            <input className="form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-buttons">
            <button className="create-btn" onClick={handleCreate}>Add Speaker</button>
            <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="speakers-grid">
        {speakers.map((s) => (
          <div key={s.id} className="speaker-card">
            <div className="speaker-card-header">
              <h3 className="speaker-name">{s.name}</h3>
              <p className="speaker-role">{s.role}</p>
              <p className="speaker-event-label">Event: <span className="speaker-event">{s.event || 'No event assigned'}</span></p>
            </div>
            <div className="speaker-footer">
              <span className="speaker-email">{s.email}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Speakers
export { initialSpeakers }