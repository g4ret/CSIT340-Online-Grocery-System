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

  const handleLike = async (product) => {
    try {
      const { data: userResult, error: userError } = await supabase.auth.getUser()

      if (userError || !userResult?.user) {
        if (showToast) {
          showToast('Sign in to save items to your wishlist.', 'info')
        }
        return
      }

      const user = userResult.user

      const { error } = await supabase
        .from('wishlists')
        .upsert({ user_id: user.id, product_id: product.id }, { onConflict: 'user_id,product_id' })

      if (error) {
        console.error('Error adding product to wishlist', error)
        if (showToast) {
          showToast('Failed to update wishlist. Please try again.', 'error')
        }
        return
      }

      if (showToast) {
        showToast('Added to wishlist.', 'success')
      }
    } catch (err) {
      console.error('Unexpected error adding product to wishlist', err)
      if (showToast) {
        showToast('Failed to update wishlist. Please try again.', 'error')
      }
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
              <button
                type="button"
                aria-label="favorite"
                onClick={() => handleLike(product)}
              >
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

