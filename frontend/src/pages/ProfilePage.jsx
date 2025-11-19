import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

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
  address: '12A Mango St., Quezon City, Metro Manila',
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

function ProfilePage({ showToast }) {
  const [activeView, setActiveView] = useState('purchase')
  const [profileData, setProfileData] = useState({
    username: profileInfo.username,
    name: profileInfo.name,
    email: profileInfo.email,
    phone: profileInfo.phone,
    gender: profileInfo.gender,
    birthDate: profileInfo.birthDate,
    address: profileInfo.address,
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true)

      try {
        const { data: userResult, error: userError } = await supabase.auth.getUser()

        if (userError || !userResult?.user) {
          setIsLoadingProfile(false)
          return
        }

        const user = userResult.user

        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) {
          console.error('Error loading profile from Supabase', profileError)
        }

        setProfileData((previous) => ({
          ...previous,
          username: user.user_metadata?.username || previous.username,
          name: profileRow?.full_name || user.user_metadata?.full_name || previous.name,
          email: user.email || previous.email,
          phone: profileRow?.phone || user.user_metadata?.phone || previous.phone,
          birthDate: profileRow?.birth_date || previous.birthDate,
          address: profileRow?.address || previous.address,
        }))
      } catch (err) {
        console.error('Unexpected error loading profile from Supabase', err)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])

  const handleFieldChange = (field, value) => {
    setProfileData((previous) => ({ ...previous, [field]: value }))
  }

  const handleSaveProfile = async () => {
    if (isSaving) return

    setIsSaving(true)

    try {
      const { data: userResult, error: userError } = await supabase.auth.getUser()

      if (userError || !userResult?.user) {
        console.error('Error getting Supabase user for profile save', userError)
        setIsSaving(false)
        return
      }

      const user = userResult.user

      const updatePayload = {
        id: user.id,
        full_name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        birth_date: profileData.birthDate,
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updatePayload, { onConflict: 'id' })

      if (error) {
        console.error('Error saving profile to Supabase', error)
        if (showToast) {
          showToast('Failed to save profile. Please try again.', 'error')
        }
      } else if (showToast) {
        showToast('Profile saved.', 'success')
      }
    } catch (err) {
      console.error('Unexpected error saving profile to Supabase', err)
      if (showToast) {
        showToast('Failed to save profile. Please try again.', 'error')
      }
    } finally {
      setIsSaving(false)
    }
  }

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
            <div className="field-value">{profileData.username}</div>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-name" className="field-label">
              Name
            </label>
            <div className="field-input">
              <input
                id="profile-name"
                type="text"
                value={profileData.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
              />
            </div>
          </div>

          <div className="profile-field">
            <span className="field-label">Email</span>
            <div className="field-value">
              <span>{profileData.email}</span>
              <button
                type="button"
                className="change-link"
                onClick={() =>
                  showToast &&
                  showToast(
                    'Changing email is not available in this demo. Use your Supabase auth user to update it.',
                    'info'
                  )
                }
              >
                Change
              </button>
            </div>
          </div>

          <div className="profile-field">
            <span className="field-label">Phone Number</span>
            <div className="field-value">
              <span>{profileData.phone}</span>
              <button
                type="button"
                className="change-link"
                onClick={() =>
                  showToast &&
                  showToast('Edit your phone number in the Default delivery address field for now.', 'info')
                }
              >
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
                  <input
                    type="radio"
                    name="gender"
                    checked={profileData.gender === option}
                    onChange={() => handleFieldChange('gender', option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile-field">
            <span className="field-label">Date of birth</span>
            <div className="field-value">
              <span>{profileData.birthDate}</span>
              <button
                type="button"
                className="change-link"
                onClick={() =>
                  showToast &&
                  showToast('Date of birth editing is not implemented in this demo.', 'info')
                }
              >
                Change
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-address" className="field-label">
              Default delivery address
            </label>
            <div className="field-input">
              <textarea
                id="profile-address"
                rows={3}
                value={profileData.address}
                onChange={(event) => handleFieldChange('address', event.target.value)}
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="button" className="profile-save" onClick={handleSaveProfile} disabled={isSaving}>
              Save
            </button>
          </div>
        </form>

        <aside className="profile-avatar-card">
          <div className="profile-photo" aria-label="Profile photo">
            <span>RB</span>
          </div>
          <button
            type="button"
            className="select-image-btn"
            onClick={() =>
              showToast &&
              showToast('Profile photo upload is not implemented in this demo.', 'info')
            }
          >
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
                    <button
                      key={storeAction}
                      type="button"
                      className="store-action"
                      onClick={() =>
                        showToast &&
                        showToast('Store interactions are not implemented in this demo.', 'info')
                      }
                    >
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
                    onClick={() =>
                      showToast &&
                      showToast(
                        action === 'Buy Again'
                          ? 'Reordering is not implemented in this demo.'
                          : 'Contact Seller is not implemented in this demo.',
                        'info'
                      )
                    }
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
                      if (
                        section.key !== 'purchase' &&
                        section.key !== 'account' &&
                        showToast
                      ) {
                        showToast(
                          'This section is for design only in this demo. Use Profile to edit your info.',
                          'info'
                        )
                      }
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
                          onClick={() => {
                            if (child.key === 'profile') {
                              setActiveView('profile')
                            } else if (showToast) {
                              showToast('This section is for design only in this demo. Use Profile to edit your info.', 'info')
                            }
                          }}
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

