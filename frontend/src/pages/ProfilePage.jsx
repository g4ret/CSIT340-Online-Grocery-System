const preferences = [
  'Push notifications for delivery updates',
  'Email receipts and promotions',
  'Remember favourite payment method',
]

const savedAddresses = [
  {
    label: 'Home',
    details: '12A Mango St., West Fairview, Quezon City 1127',
  },
  {
    label: 'Office',
    details: '8th Floor, Green Tower, Ortigas Center',
  },
]

function ProfilePage() {
  return (
    <main className="customer-module profile-page">
      <section className="home-section">
        <div className="section-top">
          <div>
            <p className="section-eyebrow">Account center</p>
            <h2>Profile & personalization</h2>
            <p>
              Manage your delivery details, preferred payment methods, and communication preferences
              in one place.
            </p>
          </div>
        </div>

        <div className="profile-grid">
          <article className="profile-card">
            <h3>Account info</h3>
            <p>Rica Blanca</p>
            <p>rica.blanca@email.com</p>
            <p>+63 917 000 0000</p>
            <button type="button" className="secondary-btn">
              Edit details
            </button>
          </article>

          <article className="profile-card">
            <h3>Saved addresses</h3>
            <ul>
              {savedAddresses.map((address) => (
                <li key={address.label}>
                  <strong>{address.label}</strong>
                  <p>{address.details}</p>
                </li>
              ))}
            </ul>
            <button type="button" className="primary-btn wide">
              Add new address
            </button>
          </article>

          <article className="profile-card">
            <h3>Preferences</h3>
            <ul>
              {preferences.map((pref) => (
                <li key={pref}>{pref}</li>
              ))}
            </ul>
            <button type="button" className="secondary-btn">
              Update preferences
            </button>
          </article>
        </div>
      </section>
    </main>
  )
}

export default ProfilePage

