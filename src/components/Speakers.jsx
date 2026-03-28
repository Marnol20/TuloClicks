import '../styles/Speakers.css'
import { Mic2, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const eventsList = [
  'Philippine Music Festival 2026',
  'Manila Tech Conference',
  'Cebu Business Summit',
  'Davao Food Festival',
]

const initialSpeakers = [
  {
    name: 'Maria Santos',
    role: 'Music Director & Composer',
    event: 'Philippine Music Festival 2026',
    email: 'maria@musicph.com',
  },
  {
    name: 'Juan dela Cruz',
    role: 'Award-Winning Singer',
    event: 'Philippine Music Festival 2026',
    email: 'juan@musicph.com',
  },
  {
    name: 'Ana Reyes',
    role: 'Music Producer',
    event: 'Philippine Music Festival 2026',
    email: 'ana@musicph.com',
  },
  {
    name: 'Carlos Garcia',
    role: 'Tech Innovator & CEO',
    event: 'Manila Tech Conference',
    email: 'carlos@techph.com',
  },
  {
    name: 'Elena Villanueva',
    role: 'AI Research Scientist',
    event: 'Manila Tech Conference',
    email: 'elena@techph.com',
  },
  {
    name: 'Roberto Tan',
    role: 'Business Strategist',
    event: 'Cebu Business Summit',
    email: 'roberto@businessph.com',
  },
  {
    name: 'Isabella Cruz',
    role: 'Entrepreneurship Coach',
    event: 'Cebu Business Summit',
    email: 'isabella@businessph.com',
  },
  {
    name: 'Miguel Santos',
    role: 'Executive Chef',
    event: 'Davao Food Festival',
    email: 'miguel@foodph.com',
  },
  {
    name: 'Sofia Reyes',
    role: 'Culinary Expert',
    event: 'Davao Food Festival',
    email: 'sofia@foodph.com',
  },
  {
    name: 'Diego Mendoza',
    role: 'Food Critic & Writer',
    event: 'Davao Food Festival',
    email: 'diego@foodph.com',
  },
]

function Speakers() {
  const [speakers, setSpeakers] = useState(initialSpeakers)
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [event, setEvent] = useState('')
  const [email, setEmail] = useState('')

  function handleCreate() {
    if (name === '' || role === '' || company === '' || email === '') {
      alert('Please fill in all fields')
      return
    }

    const newSpeaker = { name, role, event, email }
    setSpeakers([...speakers, newSpeaker])
    setShowForm(false)
    setName('')
    setRole('')
    setEvent('')
    setEmail('')
  }

  function handleCancel() {
    setShowForm(false)
    setName('')
    setRole('')
    setEvent('')
    setEmail('')
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
        <button className="add-speaker-btn" onClick={function () { setShowForm(true) }}>
          <Plus size={16} />
          Add Speaker
        </button>
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Add New Speaker</h3>
          <div className="form-grid">
            <input className="form-input" placeholder="Full Name" value={name} onChange={function (e) { setName(e.target.value) }} />
            <input className="form-input" placeholder="Role / Title" value={role} onChange={function (e) { setRole(e.target.value) }} />
            <select className="form-input" value={event} onChange={function (e) { setEvent(e.target.value) }}>
              <option value="">Select Event</option>
              {eventsList.map(function(evt) {
                return <option key={evt} value={evt}>{evt}</option>
              })}
            </select>
            <input className="form-input" placeholder="Email" value={email} onChange={function (e) { setEmail(e.target.value) }} />
          </div>
          <div className="form-buttons">
            <button className="create-btn" onClick={handleCreate}>Add Speaker</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="speakers-grid">
        {speakers.map(function (speaker) {
          return (
            <div key={speaker.email} className="speaker-card">
              <div className="speaker-card-header">
                <div>
                  <h3 className="speaker-name">{speaker.name}</h3>
                  <p className="speaker-role">{speaker.role}</p>
                  <p className="speaker-event-label">Event: <Link to="/events" className="speaker-event">{speaker.event}</Link></p>
                </div>
              </div>

              <div className="speaker-footer">
                <span className="speaker-email">{speaker.email}</span>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default Speakers

// Export data for user view
export { initialSpeakers }
