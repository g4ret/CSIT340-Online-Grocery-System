import { useState } from 'react'
import products from '../data/products'

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

function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

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
              <button type="button" aria-label="favorite">
                ♡
              </button>
              <button type="button" aria-label="view product">
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
            <button type="button" className="primary-btn wide">
              Add To Cart
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}

export default CategoryPage

