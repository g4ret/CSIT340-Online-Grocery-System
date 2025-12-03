import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const demoProduct = {
  id: 999,
  name: 'Ligo Easy Open Can Sardines In Tomato Sauce 155g',
  price: 285,
  unit: 'pack',
  badge: 'Best Seller',
  category: 'Pantry Essentials',
  packPrice: '₱142.50 (6pcs)',
  srp: '₱150.00',
  featuredPrice: '₱285.00',
  variants: [
    { id: 'tomato', label: 'Tomato', color: '#d8342f' },
    { id: 'spanish', label: 'Spanish', color: '#4a6fa5' },
  ],
  sizes: ['1', '2'],
  image: '/assets/products/lucky-mega.png',
}

const relatedProducts = [
  {
    id: 'rel-1',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    priceLabel: '₱142.50 (6pcs)',
    priceValue: 142.5,
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '6 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-2',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    priceLabel: '₱142.50 (6pcs)',
    priceValue: 142.5,
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '6 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-3',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    priceLabel: '₱142.50 (6pcs)',
    priceValue: 142.5,
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '8 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-4',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    priceLabel: '₱142.50 (6pcs)',
    priceValue: 142.5,
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '8 pcs',
    image: '/assets/products/lucky-mega.png',
  },
  {
    id: 'rel-5',
    name: 'Ligo Easy Open Can Sardines in Tomato Sauce 155g',
    priceLabel: '₱142.50 (6pcs)',
    priceValue: 142.5,
    oldPrice: '₱150.00',
    discount: '-5%',
    qtyLabel: '6 pcs',
    image: '/assets/products/lucky-mega.png',
  },
]

function ProductDetailsPage({ selectedProduct, onAddToCart, showToast }) {
  const [quantity, setQuantity] = useState(1)

  const currentProduct = {
    ...demoProduct,
    ...(selectedProduct || {}),
  }

  const basePrice = typeof currentProduct.price === 'number' ? currentProduct.price : 285
  const packPriceLabel = `₱${basePrice.toFixed(2)}`
  const srpLabel = `₱${(basePrice * 1.1).toFixed(2)}`
  const featuredPriceLabel = `₱${(basePrice * quantity).toFixed(2)}`

  const baseCartProduct = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: basePrice,
    unit: currentProduct.unit || 'pack',
    badge: currentProduct.badge || 'Best Seller',
    category: currentProduct.category || 'Pantry Essentials',
    image: currentProduct.image,
  }

  const handlePrimaryAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(baseCartProduct, quantity)
    }
    if (showToast) {
      showToast('Product added to cart.', 'success')
    }
  }

  const handleRelatedAddToCart = (item) => {
    if (!onAddToCart) return

    const cartProduct = {
      id: item.id,
      name: item.name,
      price: item.priceValue,
      unit: item.qtyLabel,
      badge: item.discount,
      category: 'Pantry Essentials',
      image: item.image,
    }

    onAddToCart(cartProduct, 1)

    if (showToast) {
      showToast('Related product added to cart.', 'success')
    }
  }

  const handleDecrement = () => {
    setQuantity((previous) => (previous > 1 ? previous - 1 : 1))
  }

  const handleIncrement = () => {
    setQuantity((previous) => previous + 1)
  }

  const handleWishlist = async () => {
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
        .upsert(
          { user_id: user.id, product_id: currentProduct.id },
          { onConflict: 'user_id,product_id' }
        )

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

  const handleShare = () => {
    if (showToast) {
      showToast('Share link copied (demo only).', 'info')
    }
  }
  return (
    <main className="product-details-page">
      <div className="product-details-shell">
        <nav className="product-breadcrumbs">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/">Pantry Essentials</a>
          <span>/</span>
          <a href="/">Canned Goods</a>
          <span>/</span>
          <span>Canned Seafood</span>
        </nav>

        <section className="product-summary-card">
          <div className="product-summary__media">
            <img src={currentProduct.image} alt={currentProduct.name} />
          </div>

          <div className="product-summary__info">
            <h1>{currentProduct.name}</h1>
            <p className="product-sub-price">
              {packPriceLabel} <span>{srpLabel}</span>
            </p>

            <div className="product-variants">
              <div>
                <span>Variants:</span>
                <div className="variant-swatches">
                  {(currentProduct.variants || demoProduct.variants).map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      className="variant-swatch"
                      style={{ backgroundColor: variant.color }}
                    >
                      <span className="sr-only">{variant.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span>Size:</span>
                <div className="size-selector">
                  {(currentProduct.sizes || demoProduct.sizes).map((size, idx) => (
                    <button key={size} type="button" className={`size-pill ${idx === 0 ? 'active' : ''}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="product-featured-price">{featuredPriceLabel}</div>

            <div className="product-quantity">
              <button type="button" aria-label="Decrease quantity" onClick={handleDecrement}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={handleIncrement}>
                +
              </button>
            </div>

            <button
              type="button"
              className="product-add-to-cart"
              onClick={handlePrimaryAddToCart}
            >
              Add to Cart
            </button>

            <div className="product-meta-actions">
              <button type="button" onClick={handleWishlist}>
                ❤
              </button>
              <button type="button" onClick={handleShare}>
                ⤴
              </button>
            </div>
          </div>
        </section>

        <section className="product-related">
          <div className="product-related__header">
            <span>Related Products</span>
          </div>

          <div className="product-related__grid">
            {relatedProducts.map((item) => (
              <article className="related-card" key={item.id}>
                <div className="related-card__badge">{item.discount}</div>
                <button
                  type="button"
                  className="related-card__fav"
                  aria-label="Add to wishlist"
                  onClick={handleWishlist}
                >
                  ❤
                </button>
                <div className="related-card__media">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <p className="related-card__qty">{item.qtyLabel}</p>
                <p className="related-card__name">{item.name}</p>
                <p className="related-card__price">
                  <strong>{item.priceLabel}</strong> <span>{item.oldPrice}</span>
                </p>
                <button
                  type="button"
                  className="related-card__cta"
                  onClick={() => handleRelatedAddToCart(item)}
                >
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

    </main>
  )
}

export default ProductDetailsPage

