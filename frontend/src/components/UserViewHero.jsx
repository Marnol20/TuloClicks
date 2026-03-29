import { Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function UserViewHero() {
  const navigate = useNavigate()
  
  return (
    <section className="user-view-hero">
      
      <h1 className="hero-headline">
        Join us for the Future of Technology
      </h1>

      <p className="hero-description">
        Three days of inspiring talks, hands-on workshops, and networking with the
        brightest minds in tech. In-person in San Francisco or streaming online.
      </p>

      <div className="hero-actions">
        <button className="hero-btn-primary" onClick={() => navigate('/user/events')}>
          Get Your Ticket
          <ArrowRight size={18} />
        </button>
        <button className="hero-btn-secondary" onClick={() => navigate('/user/events')}>
          View Schedule
        </button>
      </div>
    </section>
  )
}

export default UserViewHero
