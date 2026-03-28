import { Sparkles, ArrowRight } from 'lucide-react'

function UserViewHero({ onViewEvents }) {
  return (
    <section className="user-view-hero">
      <div className="hero-badge">
        <Sparkles size={16} className="hero-badge-icon" />
        <span>September 15-17, 2026 | San Francisco, CA</span>
      </div>

      <h1 className="hero-headline">
        Join us for the Future of Technology
      </h1>

      <p className="hero-description">
        Three days of inspiring talks, hands-on workshops, and networking with the 
        brightest minds in tech. In-person in San Francisco or streaming online.
      </p>

      <div className="hero-actions">
        <button className="hero-btn-primary" onClick={onViewEvents}>
          Get Your Ticket
          <ArrowRight size={18} />
        </button>
        <button className="hero-btn-secondary" onClick={onViewEvents}>
          View Schedule
        </button>
      </div>
    </section>
  )
}

export default UserViewHero
