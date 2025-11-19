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
  const [cartItems, setCartItems] = useState([])
  const [toast, setToast] = useState(null)
  const [checkoutItems, setCheckoutItems] = useState([])

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    const savedRole = localStorage.getItem('userRole')
    if (authStatus === 'true' && savedRole) {
      setIsAuthenticated(true)
      setUserRole(savedRole)
      setActivePage(savedRole === 'admin' ? 'adminDashboard' : 'home')
    }
  }, [])

  useEffect(() => {
    if (!toast) return

    const timerId = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timerId)
  }, [toast])

  const showToast = (message, variant = 'success') => {
    setToast({ message, variant })
  }

  const persistSession = (role, email, destination) => {
    setIsAuthenticated(true)
    setUserRole(role)
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', role)
    localStorage.setItem('userEmail', email)
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
          const result = persistSession('customer', normalizedEmail, 'home')
          showToast('Welcome back to LazShoppe! (demo login)', 'success')
          return result
        }

        return { success: false, message: error?.message || 'Invalid email or password' }
      }

      const roleFromMetadata = data.user.user_metadata?.role
      const isAdminEmail = normalizedEmail === ADMIN_CREDENTIALS.email
      const role = roleFromMetadata === 'admin' || isAdminEmail ? 'admin' : 'customer'
      const destination = role === 'admin' ? 'adminDashboard' : 'home'

      const result = persistSession(role, normalizedEmail, destination)
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
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    setActivePage('login')
    showToast('You have been logged out.', 'info')
  }

  const handleAddToCart = (product, quantity = 1) => {
    if (!product || !product.id || quantity <= 0) return

    setCartItems((previous) => {
      const existing = previous.find((item) => item.productId === product.id)
      if (existing) {
        return previous.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...previous, { productId: product.id, quantity, product }]
    })

    showToast(`${product.name} added to cart`, 'success')
  }

  const handleUpdateCartQuantity = (productId, delta) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const handleRemoveCartItems = (productIds) => {
    if (!Array.isArray(productIds) || productIds.length === 0) return

    setCartItems((previous) => previous.filter((item) => !productIds.includes(item.productId)))
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

  const handleOrderPlaced = () => {
    setCartItems((previous) =>
      previous.filter(
        (item) => !checkoutItems.some((selected) => selected.productId === item.productId)
      )
    )
    setCheckoutItems([])
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

      const result = persistSession('customer', normalizedEmail, 'home')
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
    onAddToCart: handleAddToCart,
    onUpdateCartQuantity: handleUpdateCartQuantity,
    onRemoveCartItems: handleRemoveCartItems,
    onOrderPlaced: handleOrderPlaced,
    showToast,
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
