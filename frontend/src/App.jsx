import { useState, useEffect } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import AddToCartPage from './pages/AddToCartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminUsersPage from './pages/AdminUsersPage'
import { supabase } from './lib/supabaseClient'

const pages = {
  category: { label: 'Category', component: CategoryPage },
  home: { label: 'Homepage', component: HomePage },
  product: { label: 'Product Details', component: ProductDetailsPage },
  addToCart: { label: 'Add to Cart', component: AddToCartPage },
  checkout: { label: 'Checkout', component: CheckoutPage },
  orders: { label: 'Orders & Tracking', component: OrdersPage },
  profile: { label: 'Profile', component: ProfilePage },
  login: { label: 'Login', component: LoginPage },
  register: { label: 'Register', component: RegisterPage },
  contact: { label: 'Contact', component: ContactPage },
  about: { label: 'About', component: AboutPage },
  adminDashboard: { label: 'Admin Dashboard', component: AdminDashboardPage },
  adminProducts: { label: 'Admin Products', component: AdminProductsPage },
  adminOrders: { label: 'Admin Orders', component: AdminOrdersPage },
  adminUsers: { label: 'Admin Users', component: AdminUsersPage },
}

// Temporary login credentials (remove when backend is ready)
const TEMP_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123',
}

const ADMIN_CREDENTIALS = {
  email: 'admin@lazshoppe.com',
  password: 'admin123',
}

function App() {
  const [activePage, setActivePage] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [toast, setToast] = useState(null)
  const [checkoutItems, setCheckoutItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    const savedRole = localStorage.getItem('userRole')
    const savedUserId = localStorage.getItem('userId')
    if (authStatus === 'true' && savedRole) {
      setIsAuthenticated(true)
      setUserRole(savedRole)
      if (savedUserId) {
        setUserId(savedUserId)
      }
      setActivePage(savedRole === 'admin' ? 'adminDashboard' : 'home')
    }
  }, [])

  // Restore cart items from localStorage on first load
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems')
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        if (Array.isArray(parsed)) {
          setCartItems(parsed)
        }
      }
    } catch (err) {
      console.error('Error loading cart from localStorage', err)
    }
  }, [])

  // Load cart items from Supabase for logged-in users
  useEffect(() => {
    const loadCartFromSupabase = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('product_id, quantity, products(*)')
          .eq('user_id', userId)

        if (error) {
          console.error('Error loading cart from Supabase', error)
          return
        }

        const mapped =
          data
            ?.filter((row) => row.products)
            .map((row) => ({
              productId: row.product_id,
              quantity: row.quantity,
              product: row.products,
            })) ?? []

        setCartItems(mapped)
      } catch (err) {
        console.error('Unexpected error loading cart from Supabase', err)
      }
    }

    loadCartFromSupabase()
  }, [userId])

  useEffect(() => {
    if (!toast) return

    const timerId = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timerId)
  }, [toast])

  // Persist cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch (err) {
      console.error('Error saving cart to localStorage', err)
    }
  }, [cartItems])

  const showToast = (message, variant = 'success') => {
    setToast({ message, variant })
  }

  const persistSession = (role, email, destination, newUserId = null) => {
    setIsAuthenticated(true)
    setUserRole(role)
    setUserId(newUserId || null)
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', role)
    localStorage.setItem('userEmail', email)
    if (newUserId) {
      localStorage.setItem('userId', newUserId)
    } else {
      localStorage.removeItem('userId')
    }
    setActivePage(destination)
    return { success: true }
  }

  const handleLogin = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error || !data.user) {
        if (normalizedEmail === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
          const result = persistSession('customer', normalizedEmail, 'home', null)
          showToast('Welcome back to LazShoppe! (demo login)', 'success')
          return result
        }

        return { success: false, message: error?.message || 'Invalid email or password' }
      }

      const roleFromMetadata = data.user.user_metadata?.role
      const isAdminEmail = normalizedEmail === ADMIN_CREDENTIALS.email
      const role = roleFromMetadata === 'admin' || isAdminEmail ? 'admin' : 'customer'
      const destination = role === 'admin' ? 'adminDashboard' : 'home'

      const result = persistSession(role, normalizedEmail, destination, data.user.id)
      showToast(
        role === 'admin' ? 'Logged in as admin' : 'Welcome back to LazShoppe!',
        'success'
      )
      return result
    } catch (err) {
      console.error('Error during Supabase login', err)
      return { success: false, message: 'Unable to sign in. Please try again.' }
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out from Supabase', err)
    }

    setIsAuthenticated(false)
    setUserRole(null)
    setUserId(null)
    setCartItems([])
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('cartItems')
    setActivePage('login')
    showToast('You have been logged out.', 'info')
  }

  const handleAddToCart = async (product, quantity = 1) => {
    if (!product || !product.id || quantity <= 0) return

    const existing = cartItems.find((item) => item.productId === product.id)
    let newQuantity = quantity

    if (existing) {
      newQuantity = existing.quantity + quantity
      setCartItems(
        cartItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } else {
      setCartItems([...cartItems, { productId: product.id, quantity, product }])
    }

    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .upsert(
            { user_id: userId, product_id: product.id, quantity: newQuantity },
            { onConflict: 'user_id,product_id' }
          )

        if (error) {
          console.error('Error syncing cart item to Supabase', error)
        }
      } catch (err) {
        console.error('Unexpected error syncing cart item to Supabase', err)
      }
    }

    showToast(`${product.name} added to cart`, 'success')
  }

  const handleUpdateCartQuantity = async (productId, delta) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )

    if (userId) {
      const existing = cartItems.find((item) => item.productId === productId)
      if (!existing) return

      const newQuantity = Math.max(1, existing.quantity + delta)

      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('user_id', userId)
          .eq('product_id', productId)

        if (error) {
          console.error('Error updating cart quantity in Supabase', error)
        }
      } catch (err) {
        console.error('Unexpected error updating cart quantity in Supabase', err)
      }
    }
  }

  const handleViewProductDetails = (product) => {
    if (!product || !product.id) return
    setSelectedProduct(product)
    setActivePage('product')
  }

  const handleRemoveCartItems = async (productIds) => {
    if (!Array.isArray(productIds) || productIds.length === 0) return

    setCartItems((previous) => previous.filter((item) => !productIds.includes(item.productId)))

    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .in('product_id', productIds)

        if (error) {
          console.error('Error removing cart items from Supabase', error)
        }
      } catch (err) {
        console.error('Unexpected error removing cart items from Supabase', err)
      }
    }
  }

  const handleStartCheckout = (selectedIds) => {
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      showToast('Select items to check out first.', 'info')
      return
    }

    const selected = cartItems.filter((item) => selectedIds.includes(item.productId))

    if (selected.length === 0) {
      showToast('Selected items are no longer in your cart.', 'info')
      return
    }

    setCheckoutItems(selected)
    setActivePage('checkout')
  }

  const handleOrderPlaced = async () => {
    const productIdsToRemove = checkoutItems.map((item) => item.productId)

    setCartItems((previous) =>
      previous.filter(
        (item) => !checkoutItems.some((selected) => selected.productId === item.productId)
      )
    )
    setCheckoutItems([])

    if (userId && productIdsToRemove.length) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .in('product_id', productIdsToRemove)

        if (error) {
          console.error('Error clearing checked out items from Supabase cart', error)
        }
      } catch (err) {
        console.error('Unexpected error clearing Supabase cart after order', err)
      }
    }
  }

  const handleRegister = async (userData) => {
    // Register customer using Supabase Auth
    try {
      const normalizedEmail = userData.email.trim().toLowerCase()

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            phone: userData.phone,
            role: 'customer',
          },
        },
      })

      if (error) {
        return { success: false, message: error.message }
      }

      const newUserId = data?.user?.id || null
      const result = persistSession('customer', normalizedEmail, 'home', newUserId)
      showToast('Account created successfully. You are now signed in.', 'success')
      return result
    } catch (err) {
      console.error('Error during Supabase registration', err)
      return { success: false, message: 'Unable to create account. Please try again.' }
    }
  }

  const handleNavigate = (target) => {
    if (target === 'adminDashboard' && userRole !== 'admin') {
      return
    }
    if (pages[target]) {
      setActivePage(target)
    }
  }

  const ActivePage = pages[activePage].component

  const sharedProps = {
    onNavigate: handleNavigate,
    userRole,
    onLogout: handleLogout,
    activePage,
    cartItems,
    checkoutItems,
    selectedProduct,
    onAddToCart: handleAddToCart,
    onUpdateCartQuantity: handleUpdateCartQuantity,
    onRemoveCartItems: handleRemoveCartItems,
    onOrderPlaced: handleOrderPlaced,
    showToast,
    onViewProductDetails: handleViewProductDetails,
  }

  const pageProps =
    activePage === 'addToCart'
      ? {
          ...sharedProps,
          onCheckout: (selectedIds) => handleStartCheckout(selectedIds),
        }
      : activePage === 'login'
        ? {
            ...sharedProps,
            onLogin: handleLogin,
          }
        : activePage === 'register'
          ? {
              ...sharedProps,
              onRegister: handleRegister,
            }
          : sharedProps

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <SiteHeader
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userRole={userRole}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      )}
      <div className="page-container">
        <div className="page-transition" key={activePage}>
          <ActivePage {...pageProps} />
        </div>
      </div>
      {isAuthenticated && <SiteFooter />}
      {toast && (
        <div className={`toast toast-${toast.variant}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default App
