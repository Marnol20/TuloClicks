import '../styles/Speakers.css'
import { Mic2, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const eventsList = [
  'React Conference 2024',
  'Web Development Summit',
  'AI & ML Workshop',
  'Frontend Masters Bootcamp',
]

const initialSpeakers = [
  {
    name: 'Sarah Chen',
    role: 'Senior Frontend Engineer',
    event: 'React Conference 2024',
    email: 'sarah@techcorp.com',
  },
  {
    name: 'James Wilson',
    role: 'Full Stack Developer',
    event: 'Web Development Summit',
    email: 'james@startupxyz.com',
  },
  {
    name: 'Emma Rodriguez',
    role: 'AI/ML Specialist',
    event: 'AI & ML Workshop',
    email: 'emma@ailabs.com',
  },
  {
    name: 'Michael Zhang',
    role: 'DevOps Engineer',
    event: 'React Conference 2024',
    email: 'michael@cloudsys.com',
  },
  {
    name: 'Lisa Thompson',
    role: 'UX/UI Designer',
    event: 'Frontend Masters Bootcamp',
    email: 'lisa@designstudio.com',
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
