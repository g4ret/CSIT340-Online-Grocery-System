const contactChannels = [
  {
    label: 'Customer Support',
    detail: 'support@onlinegrocery.ph',
    description: 'We reply within 1 business day',
    icon: '✉️',
  },
  {
    label: 'Order Hotline',
    detail: '+63 917 555 0123',
    description: 'Monday – Sunday, 8:00 AM – 9:00 PM',
    icon: '📞',
  },
  {
    label: 'Store Address',
    detail: 'Unit 12B, 28th St., BGC, Taguig City',
    description: 'Pick-up & walk-ins are welcome',
    icon: '📍',
  },
]

const faqs = [
  {
    question: 'Do you offer same-day delivery?',
    answer: 'Yes! Metro Manila orders placed before 4 PM qualify for same-day delivery slots.',
  },
  {
    question: 'Can I change my delivery time?',
    answer: 'You can reschedule via the Orders page up to 2 hours before the assigned rider dispatch.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We support cash on delivery, GCash, Maya, and all major debit/credit cards.',
  },
]

function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-shell">
        <section className="contact-hero">
          <p>Need a hand?</p>
          <h1>We’re here to help 7 days a week.</h1>
          <span>Reach out through any channel and our grocery concierge will assist you.</span>
        </section>

        <section className="contact-cards">
          {contactChannels.map((channel) => (
            <article key={channel.label} className="contact-card">
              <span className="contact-icon" aria-hidden="true">
                {channel.icon}
              </span>
              <div>
                <p className="contact-card__label">{channel.label}</p>
                <strong>{channel.detail}</strong>
                <p>{channel.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="contact-body">
          <div className="contact-form-card">
            <h2>Send us a message</h2>
            <p>Leave your details and we’ll get back to you within 24 hours.</p>
            <form className="contact-form">
              <div className="form-row">
                <label htmlFor="contact-name">Full Name</label>
                <input id="contact-name" type="text" placeholder="Claudine Margaret" />
              </div>
              <div className="form-row">
                <label htmlFor="contact-email">Email Address</label>
                <input id="contact-email" type="email" placeholder="you@email.com" />
              </div>
              <div className="form-row">
                <label htmlFor="contact-topic">Topic</label>
                <select id="contact-topic">
                  <option>Order concern</option>
                  <option>Delivery & logistics</option>
                  <option>Payment & refund</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" rows={4} placeholder="Tell us more about your concern..." />
              </div>
              <button type="button" className="primary-btn">
                Submit request
              </button>
            </form>
          </div>

          <aside className="contact-aside">
            <div className="map-placeholder" aria-hidden="true">
              <span>Map preview</span>
            </div>
            <div className="contact-hours">
              <h3>Store & warehouse hours</h3>
              <p>Daily, 7:00 AM – 10:00 PM</p>
              <p>Cut-off for same-day delivery is 4:00 PM</p>
            </div>
            <div className="contact-socials">
              <p>Chat with us</p>
              <div>
                <button type="button">Messenger</button>
                <button type="button">Viber</button>
                <button type="button">Instagram</button>
              </div>
            </div>
          </aside>
        </section>

        <section className="contact-faq">
          <div className="faq-header">
            <h2>Frequently asked questions</h2>
            <p>Save time by checking answers to the top questions from shoppers.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default ContactPage


