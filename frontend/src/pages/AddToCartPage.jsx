import { useEffect, useState } from 'react'

function AddToCartPage({
  cartItems = [],
  onCheckout,
  showToast,
  onUpdateCartQuantity,
  onRemoveCartItems,
}) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const [selectedIds, setSelectedIds] = useState(cartItems.map((item) => item.productId))

  useEffect(() => {
    setSelectedIds((previous) => {
      const validIds = new Set(cartItems.map((item) => item.productId))
      const next = previous.filter((id) => validIds.has(id))
      if (next.length === 0 && cartItems.length > 0) {
        return cartItems.map((item) => item.productId)
      }
      return next
    })
  }, [cartItems])

  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length

  const toggleItemSelection = (productId) => {
    setSelectedIds((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    )
  }

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(cartItems.map((item) => item.productId))
    }
  }

  const handleQuantityChange = (productId, delta) => {
    if (onUpdateCartQuantity) {
      onUpdateCartQuantity(productId, delta)
    }
  }

  const handleRowDelete = (productId) => {
    if (onRemoveCartItems) {
      onRemoveCartItems([productId])
    }
    if (showToast) {
      showToast('Item removed from cart.', 'info')
    }
  }

  const handleBulkDelete = () => {
    if (!selectedIds.length) {
      if (showToast) {
        showToast('Select items to delete first.', 'info')
      }
      return
    }

    if (onRemoveCartItems) {
      onRemoveCartItems(selectedIds)
    }
    if (showToast) {
      showToast('Selected items removed from cart.', 'success')
    }
  }

  const handleBulkMoveToLikes = () => {
    if (!selectedIds.length) {
      if (showToast) {
        showToast('Select items to move first.', 'info')
      }
      return
    }

    if (onRemoveCartItems) {
      onRemoveCartItems(selectedIds)
    }
    if (showToast) {
      showToast('Selected items moved to likes (demo only).', 'success')
    }
  }

  const handleBulkRemoveInactive = () => {
    if (showToast) {
      showToast('No inactive products to remove (demo only).', 'info')
    }
  }

  const handleFindSimilar = () => {
    if (showToast) {
      showToast('Find similar will be connected to recommendations (demo).', 'info')
    }
  }

  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.productId))
  const selectedTotalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleCheckout = () => {
    if (!selectedIds.length) {
      if (showToast) {
        showToast('Select items to check out first.', 'info')
      }
      return
    }

    if (showToast) {
      showToast('Review your order details on the checkout page.', 'info')
    }
    if (onCheckout) {
      onCheckout(selectedIds)
    }
  }

  return (
    <main className="customer-module cart-page">

      <section className="cart-section">
        <div className="cart-head">
          <div>Product</div>
          <div>Unit price</div>
          <div>Quantity</div>
          <div>Total Price</div>
          <div>Actions</div>
        </div>

        {cartItems.length === 0 && (
          <p className="empty-cart">Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <article className="merchant-block" key="cart-merchant">
            <div className="merchant-title">
              <label>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                />{' '}
                LazShoppe
              </label>
            </div>
            {cartItems.map((entry) => {
              const product = entry.product

              if (!product) {
                return null
              }

              return (
                <div className="cart-row" key={entry.productId}>
                  <label className="product-cell">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(entry.productId)}
                      onChange={() => toggleItemSelection(entry.productId)}
                    />
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <small>Qty: {entry.quantity}</small>
                    </div>
                  </label>
                  <strong>₱{product.price}</strong>
                  <div className="qty-pill">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(entry.productId, -1)}
                    >
                      -
                    </button>
                    <span>{entry.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(entry.productId, 1)}
                    >
                      +
                    </button>
                  </div>
                  <strong>₱{product.price * entry.quantity}</strong>
                  <div className="actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => handleRowDelete(entry.productId)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="link-btn subtle"
                      onClick={handleFindSimilar}
                    >
                      Find similar
                    </button>
                  </div>
                </div>
              )
            })}
          </article>
        )}
      </section>

      <footer className="cart-footer">
        <div className="bulk-actions">
          <label>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleAll}
            />{' '}
            Select all ({totalItems})
          </label>
          <button type="button" onClick={handleBulkDelete}>
            Delete
          </button>
          <button type="button" onClick={handleBulkRemoveInactive}>
            Remove inactive products
          </button>
          <button type="button" onClick={handleBulkMoveToLikes}>
            Move to likes
          </button>
        </div>
        <div className="checkout-summary">
          <div>
            Total ({selectedTotalItems} item
            {selectedTotalItems > 1 ? 's' : ''}): <strong>₱{selectedTotalPrice}</strong>
          </div>
          <button type="button" className="checkout-btn" onClick={handleCheckout}>
            Check Out
          </button>
        </div>
      </footer>
    </main>
  )
}

export default AddToCartPage

