import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const categoryOptions = [
  'All',
  'Pantry Essentials',
  'Breakfast World',
  'Wines & Liquors',
  'Lifestyle Cooking',
  'Snacks & Sweets',
  'Health & Beauty',
  'Bakery & Dairy',
]

function CategoryPage({ onAddToCart, onNavigate, showToast, onViewProductDetails }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')

      if (error) {
        console.error('Error loading products from Supabase', error)
      } else {
        setProducts(data)
      }

      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const handleLike = () => {
    if (showToast) {
      showToast('Added to wishlist (demo only).', 'info')
    }
  }

  const handleViewDetails = (product) => {
    if (onViewProductDetails && product) {
      onViewProductDetails(product)
      return
    }
    if (onNavigate) {
      onNavigate('product')
    }
  }

  return (
    <main className="customer-module category-page">
      <div className="category-filter">
        {categoryOptions.map((category) => (
          <button
            key={category}
            type="button"
            className={category === selectedCategory ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <article className="home-product-card" key={product.id}>
            <span className="discount-pill">-5%</span>
            <div className="product-actions">
              <button type="button" aria-label="favorite" onClick={handleLike}>
                ♡
              </button>
              <button
                type="button"
                aria-label="view product"
                onClick={() => handleViewDetails(product)}
              >
                👁
              </button>
            </div>
            <img src={product.image} alt={product.name} loading="lazy" />
            <p className="stock-count">{product.category}</p>
            <h3>{product.name}</h3>
            <div className="price-row">
              <strong>₱{product.price}</strong>
              <span className="old-price">₱{product.price + 10}</span>
            </div>
            <button
              type="button"
              className="primary-btn wide"
              onClick={() => onAddToCart && onAddToCart(product)}
            >
              Add To Cart
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}

export default CategoryPage

