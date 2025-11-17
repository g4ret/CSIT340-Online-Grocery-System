import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import AddToCartPage from './pages/AddToCartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
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
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const ActivePage = pages[activePage].component
  const handleNavigate = (target) => {
    if (pages[target]) {
      setActivePage(target)
    }
  }

  return (
    <div className="app-shell">
      <SiteHeader activePage={activePage} onNavigate={handleNavigate} />
      <div className="page-container">
        <div className="page-transition" key={activePage}>
          <ActivePage />
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}

export default App
