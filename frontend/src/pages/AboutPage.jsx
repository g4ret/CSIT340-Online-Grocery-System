const milestones = [
  { label: 'Cities served', value: '18+' },
  { label: 'Local farms onboard', value: '120' },
  { label: 'Average delivery time', value: '45 mins' },
  { label: 'Customer satisfaction', value: '4.9/5' },
]

const values = [
  {
    title: 'Fresh-first sourcing',
    description: 'We pick straight from farmers & artisanal producers every morning.',
  },
  {
    title: 'Community powered',
    description: 'We employ riders within each neighborhood and invest back into barangays.',
  },
  {
    title: 'Sustainable choices',
    description: 'Reusable crates, zero styrofoam policy, and optimized delivery routes.',
  },
]

const team = [
  { name: 'Gia Morales', role: 'Founder & CEO', initials: 'GM' },
  { name: 'Renzo Dela Cruz', role: 'Head of Operations', initials: 'RC' },
  { name: 'Pauline Chua', role: 'Customer Experience Lead', initials: 'PC' },
]

function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-shell">
        <section className="about-hero">
          <p>About LazShoppe</p>
          <h1>Delivering market-fresh groceries to Filipino homes since 2017.</h1>
          <span>
            We partner with growers, fisherfolk, and social enterprises to bring mindful choices to your daily table.
          </span>
          <div className="about-metrics">
            {milestones.map((milestone) => (
              <article key={milestone.label}>
                <strong>{milestone.value}</strong>
                <p>{milestone.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-story">
          <div>
            <h2>Our Story</h2>
            <p>
              We started as a weekend pop-up stall in Makati sourcing backyard produce from Nueva Ecija. At the height of
              the lockdowns, we digitized the whole experience—building a logistics network that now connects fresh goods
              to thousands of households every day.
            </p>
            <p>
            Today, LazShoppe is a hybrid marketplace and dark-store operator combining personal shoppers, climate
              controlled hubs, and a rider fleet optimized for quick but careful deliveries.
            </p>
          </div>
          <div className="about-highlight">
            <h3>Our promise</h3>
            <ul>
              <li>Curated picks that pass a 5-step freshness check</li>
              <li>Transparent tracking from farm to doorstep</li>
              <li>Carbon neutral deliveries by 2026</li>
            </ul>
          </div>
        </section>

        <section className="about-values">
          {values.map((value) => (
            <article key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </section>

        <section className="about-team">
          <header>
            <h2>The team behind the baskets</h2>
            <p>Lean, mission-driven, and obsessed with customer delight.</p>
          </header>
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name}>
                <div className="team-avatar">{member.initials}</div>
                <p className="team-name">{member.name}</p>
                <p className="team-role">{member.role}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AboutPage


