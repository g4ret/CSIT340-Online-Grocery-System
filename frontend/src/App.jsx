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

  const persistSession = (role, email, destination) => {
    setIsAuthenticated(true)
    setUserRole(role)
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', role)
    localStorage.setItem('userEmail', email)
    setActivePage(destination)
    return { success: true }
  }

  const handleLogin = (email, password) => {
    // Temporary login check (replace with backend API call)
    const isAdmin =
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password

    if (isAdmin) {
      return persistSession('admin', ADMIN_CREDENTIALS.email, 'adminDashboard')
    }

    if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
      return persistSession('customer', email, 'home')
    } else {
      return { success: false, message: 'Invalid email or password' }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    setActivePage('login')
  }

  const handleRegister = (userData) => {
    // Temporary registration (just store in localStorage for demo)
    // In real app, this would call backend API
    return persistSession('customer', userData.email, 'home')
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

  const sharedProps = { onNavigate: handleNavigate, userRole, onLogout: handleLogout }

  const pageProps =
    activePage === 'addToCart'
      ? {
          ...sharedProps,
          onCheckout: () => handleNavigate('checkout'),
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
        />
      )}
      <div className="page-container">
        <div className="page-transition" key={activePage}>
          <ActivePage {...pageProps} />
        </div>
      </div>
      {isAuthenticated && <SiteFooter />}
    </div>
  )
}

export default App
