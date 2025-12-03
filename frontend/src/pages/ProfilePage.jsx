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
  const [orders, setOrders] = useState([])
  const [orderItemsByOrderId, setOrderItemsByOrderId] = useState({})
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [activeOrderTab, setActiveOrderTab] = useState('All')
  const [orderSearch, setOrderSearch] = useState('')

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

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoadingOrders(true)
      setOrdersError(null)

      try {
        const { data: userResult, error: userError } = await supabase.auth.getUser()

        if (userError || !userResult?.user) {
          setOrders([])
          setOrderItemsByOrderId({})
          setIsLoadingOrders(false)
          return
        }

        const user = userResult.user

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersError) {
          console.error('Error loading orders for profile page', ordersError)
          setOrdersError('Failed to load your orders.')
          setOrders([])
          setOrderItemsByOrderId({})
          return
        }

        const nextOrders = ordersData || []
        setOrders(nextOrders)

        if (!nextOrders.length) {
          setOrderItemsByOrderId({})
          return
        }

        const orderIds = nextOrders.map((order) => order.id)

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds)

        if (itemsError) {
          console.error('Error loading order items for profile page', itemsError)
          setOrdersError('Failed to load order items.')
          setOrderItemsByOrderId({})
          return
        }

        const grouped = {}
        for (const item of itemsData || []) {
          const key = item.order_id
          if (!grouped[key]) {
            grouped[key] = []
          }
          grouped[key].push(item)
        }

        setOrderItemsByOrderId(grouped)
      } catch (err) {
        console.error('Unexpected error loading orders for profile page', err)
        setOrdersError('Failed to load your orders.')
        setOrders([])
        setOrderItemsByOrderId({})
      } finally {
        setIsLoadingOrders(false)
      }
    }

    loadOrders()
  }, [])

  const formatCurrency = (value) => {
    const numeric = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(numeric)) return '0.00'
    return numeric.toFixed(2)
  }

  const getOrderLogisticsNote = (status) => {
    const normalized = (status || '').toLowerCase()

    if (normalized === 'pending') return 'Order received and being prepared.'
    if (normalized === 'packed') return 'Items are packed and ready for dispatch.'
    if (normalized === 'out for delivery') return 'Rider is on the way.'
    if (normalized === 'delivered') return 'Parcel has been delivered.'
    if (normalized === 'cancelled') return 'Order was cancelled.'

    return 'Order status update in progress.'
  }

  const shouldIncludeOrderInTab = (tab, status) => {
    const normalized = (status || '').toLowerCase()

    if (tab === 'All') return true
    if (tab === 'To Pay') return normalized === 'pending'
    if (tab === 'To Ship') return normalized === 'packed'
    if (tab === 'To Receive') return normalized === 'out for delivery'
    if (tab === 'Completed') return normalized === 'delivered'
    if (tab === 'Cancelled') return normalized === 'cancelled'
    if (tab === 'Return Refund') return false

    return true
  }

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

  const renderOrders = () => {
    const searchTerm = orderSearch.trim().toLowerCase()

    const filteredOrders = orders.filter((order) => {
      if (!shouldIncludeOrderInTab(activeOrderTab, order.status)) {
        return false
      }

      if (!searchTerm) {
        return true
      }

      const orderNumber = (order.order_number || '').toLowerCase()
      if (orderNumber.includes(searchTerm)) {
        return true
      }

      const items = orderItemsByOrderId[order.id] || []
      const hasMatchingItem = items.some((item) =>
        (item.product_name || '').toLowerCase().includes(searchTerm)
      )

      return hasMatchingItem
    })

    return (
      <section className="profile-orders">
        <header className="orders-header">
          <h1>My Purchase</h1>
          <div className="order-tabs">
            {orderTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`order-tab ${activeOrderTab === tab ? 'active' : ''}`}
                onClick={() => setActiveOrderTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="order-search">
          <input
            type="search"
            placeholder="You can search by Seller Name, Order ID or Product name"
            value={orderSearch}
            onChange={(event) => setOrderSearch(event.target.value)}
          />
        </div>

        <div className="order-list">
          {isLoadingOrders ? (
            <p>Loading your orders...</p>
          ) : ordersError ? (
            <p>{ordersError}</p>
          ) : filteredOrders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            filteredOrders.map((order) => {
              const items = orderItemsByOrderId[order.id] || []
              const totalAmount = Number(order.total_amount) || 0
              const orderTotalLabel = `\u20b1${formatCurrency(totalAmount)}`
              const logisticsNote = getOrderLogisticsNote(order.status)

              return (
                <article key={order.id} className="order-card">
                  <header className="order-card__header">
                    <div className="store-meta">
                      <p className="store-name">LazShoppe</p>
                      <div className="store-actions">
                        {['Chat', 'View Shop'].map((storeAction) => (
                          <button
                            key={storeAction}
                            type="button"
                            className="store-action"
                            onClick={() =>
                              showToast &&
                              showToast(
                                'Store interactions are not implemented in this demo.',
                                'info'
                              )
                            }
                          >
                            {storeAction}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="status-meta">
                      <span className="delivery-note">{logisticsNote}</span>
                      <span className="order-status">{order.status || 'Pending'}</span>
                    </div>
                  </header>

                  <div className="order-items">
                    {items.length === 0 ? (
                      <p className="order-empty-items">No line items found for this order.</p>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="order-item">
                          <div className="item-info">
                            <div className="item-thumb" aria-hidden="true">
                              <span>🛒</span>
                            </div>
                            <div>
                              <p className="item-name">{item.product_name}</p>
                              <p className="item-variation">Qty {item.quantity}</p>
                            </div>
                          </div>
                          <div className="item-price">
                            <span>\u20b1{formatCurrency(item.unit_price)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <footer className="order-card__footer">
                    <div className="order-total">
                      Order Total:&nbsp;<strong>{orderTotalLabel}</strong>
                    </div>
                    <div className="order-actions">
                      {['Buy Again', 'Contact Seller'].map((action) => (
                        <button
                          key={action}
                          type="button"
                          className={`order-action ${
                            action === 'Buy Again' ? 'primary' : 'ghost'
                          }`}
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
              )
            })
          )}
        </div>
      </section>
    )
  }

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

