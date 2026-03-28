import { Mic2 } from 'lucide-react'

// Import admin data
import { initialSpeakers } from './Speakers'

const speakersData = initialSpeakers.map((speaker, index) => ({
  id: index + 1,
  name: speaker.name,
  role: speaker.role,
  company: 'TechCorp', // Default company
  bio: `${speaker.name} is a passionate speaker with extensive experience in their field.`,
  emoji: index % 2 === 0 ? '👩‍💼' : '👨‍💻', // Alternate emojis
}))

function UserViewSpeakers() {
  return (
    <section className="user-view-speakers">
      <div className="section-header">
        <p className="section-label">Speakers</p>
        <h2 className="section-title">Meet Our Experts</h2>
      </div>

      <div className="speakers-grid">
        {speakersData.map(function(speaker) {
          return (
            <div className="speaker-card" key={speaker.id}>
              <h3 className="speaker-name">{speaker.name}</h3>
              <p className="speaker-role">
                <Mic2 size={14} style={{ display: 'inline', marginRight: '6px' }} />
                {speaker.role}
              </p>
              <p className="speaker-company">{speaker.company}</p>
              <p className="speaker-bio">{speaker.bio}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UserViewSpeakers
