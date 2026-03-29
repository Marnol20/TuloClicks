import '../styles/StatCard.css'

function StatCard(props) {
  const Icon = props.icon

  return (
    <div className="stat-card">

      <div style={{ color: props.iconColor }}>
        <Icon size={18} />
      </div>

      <div>
        <p className="stat-label">{props.label}</p>
        <p className="stat-value">{props.value}</p>
      </div>

    </div>
  )
}

export default StatCard