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
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

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
}

// Temporary login credentials (remove when backend is ready)
const TEMP_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123',
}

function App() {
  const [activePage, setActivePage] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      setActivePage('home')
    }
  }, [])

  const handleLogin = (email, password) => {
    // Temporary login check (replace with backend API call)
    if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', email)
      setActivePage('home')
      return { success: true }
    } else {
      return { success: false, message: 'Invalid email or password' }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    setActivePage('login')
  }

  const handleRegister = (userData) => {
    // Temporary registration (just store in localStorage for demo)
    // In real app, this would call backend API
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userEmail', userData.email)
    setIsAuthenticated(true)
    setActivePage('home')
    return { success: true }
  }

  const handleNavigate = (target) => {
    if (pages[target]) {
      setActivePage(target)
    }
  }

  const ActivePage = pages[activePage].component

  const pageProps =
    activePage === 'addToCart'
      ? {
          onCheckout: () => handleNavigate('checkout'),
        }
      : activePage === 'login'
        ? {
            onNavigate: handleNavigate,
            onLogin: handleLogin,
          }
        : activePage === 'register'
          ? {
              onNavigate: handleNavigate,
              onRegister: handleRegister,
            }
          : {}

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <SiteHeader activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout} />
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
