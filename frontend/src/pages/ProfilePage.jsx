import { useState } from 'react'

const sidebarSections = [
  {
    label: 'My Account',
    key: 'account',
    icon: '👤',
    children: [
      { label: 'Profile', key: 'profile' },
      { label: 'Banks & Cards', key: 'banks' },
      { label: 'Addresses', key: 'addresses' },
      { label: 'Change Password', key: 'password' },
      { label: 'Privacy Settings', key: 'privacy' },
      { label: 'Notification Settings', key: 'notifications' },
    ],
  },
  { label: 'My Purchase', key: 'purchase', icon: '🛒' },
  { label: 'Notifications', key: 'alerts', icon: '🔔' },
  { label: 'My Vouchers', key: 'vouchers', icon: '🎟️' },
  { label: 'My Shopee Coins', key: 'coins', icon: '🪙' },
]

const orderTabs = ['All', 'To Pay', 'To Ship', 'To Receive', 'Completed', 'Cancelled', 'Return Refund']

const profileInfo = {
  username: 'ricablancam',
  name: 'Claudine Margaret Ricablanca',
  email: 'ri************@gmail.com',
  phone: '********35',
  gender: 'Other',
  birthDate: '**/**/2002',
}

const orders = [
  {
    id: 'UGREEN-001',
    store: 'Ugreen Flagship Store',
    isMall: true,
    status: 'COMPLETED',
    logisticsNote: 'Parcel has been delivered',
    total: '₱219',
    storeActions: ['Chat', 'View Shop'],
    actions: ['Buy Again', 'Contact Seller'],
    items: [
      {
        name: 'UGREEN 100W USB C to C Cable for iPhone 15 Pro Max PD Fast Charging Charger',
        variation: 'Variation: USB C 1M',
        price: '₱249',
        crossedPrice: '₱699',
        quantity: 1,
        thumbnail: '/assets/products/ugreen-cable.png',
      },
    ],
  },
  {
    id: 'THREADS-002',
    store: 'Insta Threads PH',
    isMall: false,
    status: 'COMPLETED',
    logisticsNote: 'Parcel has been delivered',
    total: '₱700',
    storeActions: ['Chat', 'View Shop'],
    actions: ['Buy Again', 'Contact Seller'],
    items: [
      {
        name: 'INSTA THREAD PlainCrop PROCLUB T-Shirt for Men and Women',
        variation: 'Variation: BLACK, XXL',
        price: '₱175',
        quantity: 2,
        thumbnail: '/assets/products/insta-thread-black.png',
      },
      {
        name: 'INSTA THREAD PlainCrop PROCLUB T-Shirt for Men and Women',
        variation: 'Variation: WHITE, XXL',
        price: '₱175',
        quantity: 2,
        thumbnail: '/assets/products/insta-thread-white.png',
      },
    ],
  },
]

function ProfilePage() {
  const [activeView, setActiveView] = useState('purchase')

  const renderProfileDetails = () => (
    <section className="profile-account">
      <header className="account-header">
        <h1>My Profile</h1>
        <p>Manage and protect your account</p>
      </header>

      <div className="profile-account__card">
        <form className="profile-form">
          <div className="profile-field">
            <span className="field-label">Username</span>
            <div className="field-value">{profileInfo.username}</div>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-name" className="field-label">
              Name
            </label>
            <div className="field-input">
              <input id="profile-name" type="text" defaultValue={profileInfo.name} />
            </div>
          </div>

          <div className="profile-field">
            <span className="field-label">Email</span>
            <div className="field-value">
              <span>{profileInfo.email}</span>
              <button type="button" className="change-link">
                Change
              </button>
            </div>
          </div>

          <div className="profile-field">
            <span className="field-label">Phone Number</span>
            <div className="field-value">
              <span>{profileInfo.phone}</span>
              <button type="button" className="change-link">
                Change
              </button>
            </div>
          </div>

          <div className="profile-field">
            <span className="field-label">
              Gender <span aria-hidden="true">?</span>
            </span>
            <div className="gender-options">
              {['Male', 'Female', 'Other'].map((option) => (
                <label key={option} className="gender-option">
                  <input type="radio" name="gender" checked={profileInfo.gender === option} readOnly />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile-field">
            <span className="field-label">Date of birth</span>
            <div className="field-value">
              <span>{profileInfo.birthDate}</span>
              <button type="button" className="change-link">
                Change
              </button>
            </div>
          </div>

          <div className="profile-actions">
            <button type="button" className="profile-save">
              Save
            </button>
          </div>
        </form>

        <aside className="profile-avatar-card">
          <div className="profile-photo" aria-label="Profile photo">
            <span>RB</span>
          </div>
          <button type="button" className="select-image-btn">
            Select Image
          </button>
          <p>File size: maximum 1 MB</p>
          <p>File extension: .JPEG, .PNG</p>
        </aside>
      </div>
    </section>
  )

  const renderOrders = () => (
    <section className="profile-orders">
      <header className="orders-header">
        <h1>My Purchase</h1>
        <div className="order-tabs">
          {orderTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`order-tab ${index === 0 ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="order-search">
        <input type="search" placeholder="You can search by Seller Name, Order ID or Product name" />
      </div>

      <div className="order-list">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <header className="order-card__header">
              <div className="store-meta">
                <p className="store-name">
                  {order.isMall && <span className="mall-badge">Mall</span>}
                  {order.store}
                </p>
                <div className="store-actions">
                  {order.storeActions.map((storeAction) => (
                    <button key={storeAction} type="button" className="store-action">
                      {storeAction}
                    </button>
                  ))}
                </div>
              </div>
              <div className="status-meta">
                <span className="delivery-note">{order.logisticsNote}</span>
                <span className="order-status">{order.status}</span>
              </div>
            </header>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={item.name + idx} className="order-item">
                  <div className="item-info">
                    <div className="item-thumb" aria-hidden="true">
                      <span>{item.thumbnail ? '🛒' : '📦'}</span>
                    </div>
                    <div>
                      <p className="item-name">{item.name}</p>
                      <p className="item-variation">
                        {item.variation} &middot; Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="item-price">
                    {item.crossedPrice && <span className="crossed">{item.crossedPrice}</span>}
                    <span>{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <footer className="order-card__footer">
              <div className="order-total">
                Order Total:&nbsp;<strong>{order.total}</strong>
              </div>
              <div className="order-actions">
                {order.actions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className={`order-action ${action === 'Buy Again' ? 'primary' : 'ghost'}`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )

  return (
    <main className="profile-page shopee-template">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-user">
            <div className="avatar-circle">RB</div>
            <div>
              <p className="username">ricablancam</p>
              <button type="button" className="link-btn" onClick={() => setActiveView('profile')}>
                Edit Profile
              </button>
            </div>
          </div>

          <nav className="sidebar-nav">
            {sidebarSections.map((section) => {
              const sectionActive =
                section.key === activeView ||
                section.children?.some((child) => child.key === activeView)

              return (
                <div key={section.label} className="sidebar-section">
                  <button
                    type="button"
                    className={`sidebar-link head ${sectionActive ? 'active' : ''}`}
                    onClick={() => {
                      if (section.key === 'purchase') setActiveView('purchase')
                      if (section.key === 'account' && activeView !== 'profile') setActiveView('profile')
                    }}
                  >
                    <span className="sidebar-icon" aria-hidden="true">
                      {section.icon}
                    </span>
                    <span className="link-label">{section.label}</span>
                  </button>

                  {section.children && (
                    <div className="sidebar-submenu">
                      {section.children.map((child) => (
                        <button
                          key={child.label}
                          type="button"
                          className={`sidebar-sublink ${activeView === child.key ? 'active' : ''}`}
                          onClick={() => child.key === 'profile' && setActiveView('profile')}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </aside>

        {activeView === 'profile' ? renderProfileDetails() : renderOrders()}
      </div>
    </main>
  )
}

export default ProfilePage

