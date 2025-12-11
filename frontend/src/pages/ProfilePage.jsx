import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const profileTabs = [
  { key: 'profile', label: 'My Profile' },
  { key: 'address', label: 'Address Book' },
  { key: 'orders', label: 'My Orders' },
]

const profileInfo = {
  username: 'ricablancam',
  name: 'Claudine Margaret Ricablanca',
  email: 'ri************@gmail.com',
  phone: '********35',
  gender: 'Other',
  birthDate: '**/**/2002',
  address: '12A Mango St., Quezon City, Metro Manila',
}

function ProfilePage({ showToast, userId, userEmail }) {
  const [activeView, setActiveView] = useState('profile')
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
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true)

      try {
        const { data: userResult } = await supabase.auth.getUser()
        const supabaseUser = userResult?.user
        const userIdentifier = supabaseUser?.id || userId
        const fallbackEmail = userEmail || profileData.email

        let profileRow = null

        if (userIdentifier) {
          const { data: profileDataRow, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userIdentifier)
            .maybeSingle()

          if (profileError) {
            console.error('Error loading profile from Supabase', profileError)
          } else {
            profileRow = profileDataRow
          }
        }

        const activeEmail = supabaseUser?.email || fallbackEmail
        const activeName =
          profileRow?.full_name || supabaseUser?.user_metadata?.full_name || profileData.name
        const activePhone = profileRow?.phone || supabaseUser?.user_metadata?.phone || profileData.phone
        const activeAddress = profileRow?.address || profileData.address
        const activeUsername = supabaseUser?.user_metadata?.username || profileData.username
        const activeBirthDate = profileRow?.birth_date || profileData.birthDate

        setProfileData((previous) => ({
          ...previous,
          username: activeUsername || previous.username,
          name: activeName || previous.name,
          email: activeEmail || previous.email,
          phone: activePhone || previous.phone,
          birthDate: activeBirthDate || previous.birthDate,
          address: activeAddress || previous.address,
        }))
      } catch (err) {
        console.error('Unexpected error loading profile from Supabase', err)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoadingOrders(true)
      setOrdersError(null)

      try {
        const { data: userResult } = await supabase.auth.getUser()
        const supabaseUser = userResult?.user
        const userIdentifier = supabaseUser?.id || userId

        if (!userIdentifier) {
          setOrders([])
          setIsLoadingOrders(false)
          return
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userIdentifier)
          .order('created_at', { ascending: false })

        if (ordersError) {
          console.error('Error loading orders for profile page', ordersError)
          setOrdersError('Failed to load your orders.')
          setOrders([])
          return
        }

        setOrders(ordersData || [])
      } catch (err) {
        console.error('Unexpected error loading orders for profile page', err)
        setOrdersError('Failed to load your orders.')
        setOrders([])
      } finally {
        setIsLoadingOrders(false)
      }
    }

    loadOrders()
  }, [userId])

  const formatCurrency = (value) => {
    const numeric = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(numeric)) return '0.00'
    return numeric.toFixed(2)
  }

  const formatDate = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
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

  const updateLocalOrders = (orderId) => {
    try {
      const cached = JSON.parse(localStorage.getItem('ordersLocal') || '[]')
      if (!Array.isArray(cached)) return
      const next = cached.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o))
      localStorage.setItem('ordersLocal', JSON.stringify(next))
    } catch (err) {
      console.error('Error updating local order cache after cancel', err)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!orderId || cancellingId) return

    setCancellingId(orderId)
    try {
      const { data: userResult } = await supabase.auth.getUser()
      const supabaseUser = userResult?.user
      const userIdentifier = supabaseUser?.id || userId

      if (!userIdentifier) {
        if (showToast) {
          showToast('Please sign in to cancel orders.', 'error')
        }
        return
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'Cancelled' })
        .eq('id', orderId)
        .eq('user_id', userIdentifier)

      if (updateError) {
        console.error('Error cancelling order', updateError)
        if (showToast) {
          showToast('Failed to cancel order. Please try again.', 'error')
        }
        return
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o)))
      updateLocalOrders(orderId)
    } catch (err) {
      console.error('Unexpected error cancelling order', err)
      if (showToast) {
        showToast('Failed to cancel order. Please try again.', 'error')
      }
    } finally {
      setCancellingId(null)
    }
  }

  const handleFieldChange = (field, value) => {
    setProfileData((previous) => ({ ...previous, [field]: value }))
  }

  const handleSaveProfile = async () => {
    if (isSaving) return

    setIsSaving(true)

    try {
      const { data: userResult } = await supabase.auth.getUser()
      const supabaseUser = userResult?.user
      const userIdentifier = supabaseUser?.id || userId

      if (!userIdentifier) {
        if (showToast) {
          showToast('Please sign in to update your profile.', 'error')
        }
        setIsSaving(false)
        return
      }

      const updatePayload = {
        id: userIdentifier,
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
    <section className="profile-card">
      <div className="card-header">
        <h1>Edit Your Profile</h1>
      </div>

      <form className="card-body profile-form-simple">
        <div className="form-row">
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            type="text"
            placeholder="Your name"
            value={profileData.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="profile-email">Email</label>
          <input id="profile-email" type="email" value={profileData.email} disabled />
        </div>

        <div className="form-row-group">
          <label>Password Changes</label>
          <input type="password" placeholder="Current Password" disabled />
          <input type="password" placeholder="New Password" disabled />
          <input type="password" placeholder="Confirm New Password" disabled />
        </div>

        <div className="card-actions">
          <button type="button" onClick={handleSaveProfile} disabled={isSaving}>
            Edit Profile
          </button>
        </div>
      </form>
    </section>
  )

  const renderOrders = () => (
    <section className="profile-card">
      <div className="card-header">
        <h1>My Orders</h1>
        <p>Track your order history and current orders</p>
      </div>
      <div className="card-body orders-grid">
        {isLoadingOrders ? (
          <p>Loading your orders...</p>
        ) : ordersError ? (
          <p>{ordersError}</p>
        ) : orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          orders.map((order) => {
            const totalAmount = formatCurrency(order.total_amount)
            const createdDate = formatDate(order.created_at)
            const statusLabel = order.status || 'Pending'
            return (
              <article className="order-summary-card" key={order.id}>
                <div className="order-summary__header">
                  <div>
                    <p className="order-number">{order.order_number || order.id}</p>
                    {createdDate && <small>{createdDate}</small>}
                  </div>
                  <span className="status-pill">{statusLabel}</span>
                </div>
                <div className="order-summary__body">
                  <div>
                    <p>Total Payment</p>
                    <strong>₱{totalAmount}</strong>
                  </div>
                  <div>
                    <p>Logistics</p>
                    <small>{getOrderLogisticsNote(order.status)}</small>
                  </div>
                </div>
                {['Pending', 'Packed', 'pending', 'packed'].includes(order.status || '') && (
                  <div className="order-actions-row">
                    <button
                      type="button"
                      className="order-action-button cancel"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                    >
                      {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  </div>
                )}
              </article>
            )
          })
        )}
      </div>
    </section>
  )

  const renderAddress = () => (
    <section className="profile-card">
      <div className="card-header">
        <h1>Address Book</h1>
      </div>
      <form className="card-body address-form">
        <div className="form-row">
          <label htmlFor="profile-address">Address</label>
          <input
            id="profile-address"
            type="text"
            placeholder="Enter your address"
            value={profileData.address}
            onChange={(event) => handleFieldChange('address', event.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="profile-phone">Phone Number</label>
          <input
            id="profile-phone"
            type="tel"
            placeholder="Enter your phone number"
            value={profileData.phone}
            onChange={(event) => handleFieldChange('phone', event.target.value)}
          />
        </div>
        <div className="card-actions">
          <button type="button" onClick={handleSaveProfile} disabled={isSaving}>
            Edit Address
          </button>
        </div>
      </form>
    </section>
  )

  return (
    <main className="profile-page modern-profile">
      <div className="profile-shell">
        <aside className="profile-nav">
          {profileTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`profile-nav__item ${activeView === tab.key ? 'active' : ''}`}
              onClick={() => setActiveView(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <section className="profile-content">
          {activeView === 'profile' && renderProfileDetails()}
          {activeView === 'address' && renderAddress()}
          {activeView === 'orders' && renderOrders()}
        </section>
      </div>
    </main>
  )
}

export default ProfilePage

