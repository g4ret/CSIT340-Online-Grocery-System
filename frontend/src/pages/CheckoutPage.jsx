import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function CheckoutPage({
  showToast,
  onNavigate,
  onOrderPlaced,
  checkoutItems = [],
  userId,
  userEmail,
}) {
  const [profileAddress, setProfileAddress] = useState(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true)

      try {
        const { data: userResult } = await supabase.auth.getUser()
        const supaUser = userResult?.user
        const fallbackUser = userId ? { id: userId, email: userEmail || '' } : null
        const activeUser = supaUser || fallbackUser

        if (!activeUser) {
          setIsLoadingProfile(false)
          return
        }

        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', activeUser.id)
          .maybeSingle()

        if (profileError) {
          console.error('Error loading profile for checkout', profileError)
        }

        if (profileRow) {
          setProfileAddress({
            name: profileRow.full_name || supaUser?.user_metadata?.full_name || activeUser.email,
            phone: profileRow.phone || supaUser?.user_metadata?.phone || '',
            address: profileRow.address || '',
          })
        } else {
          setProfileAddress({
            name: supaUser?.user_metadata?.full_name || activeUser.email,
            phone: supaUser?.user_metadata?.phone || '',
            address: '',
          })
        }
      } catch (err) {
        console.error('Unexpected error loading checkout profile', err)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )
  const shippingFee = 175

  const handlePlaceOrder = async () => {
    if (!checkoutItems.length) {
      if (showToast) {
        showToast('No items selected for checkout.', 'info')
      }
      return
    }

    const persistLocalOrder = (order) => {
      try {
        const existing = JSON.parse(localStorage.getItem('ordersLocal') || '[]')
        const next = Array.isArray(existing) ? existing : []
        next.unshift(order)
        localStorage.setItem('ordersLocal', JSON.stringify(next.slice(0, 50)))
      } catch (err) {
        console.error('Error saving local order cache', err)
      }
    }

    try {
      const { data: userResult } = await supabase.auth.getUser()
      const supabaseUser = userResult?.user
      const userRef = supabaseUser || (userId ? { id: userId, email: userEmail || '' } : null)

      if (!userRef) {
        if (showToast) {
          showToast('You must be signed in to place an order.', 'error')
        }
        return
      }

      const user = userRef
      const totalItems = checkoutItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = subtotal + shippingFee

      const orderNumber = `OGS-${new Date().getFullYear()}-${Date.now()}`

      const { data: orderInsert, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'Pending',
          total_items: totalItems,
          subtotal,
          shipping_fee: shippingFee,
          total_amount: totalAmount,
        })
        .select()
        .single()

      if (orderError || !orderInsert) {
        console.error('Error creating order', orderError)
        if (showToast) {
          showToast('Failed to place order. Please try again.', 'error')
        }
        return
      }

      persistLocalOrder({
        id: orderInsert.id,
        user_id: userRef.id,
        order_number: orderInsert.order_number,
        status: orderInsert.status,
        total_amount: orderInsert.total_amount,
        created_at: orderInsert.created_at || new Date().toISOString(),
      })

      const orderItemsPayload = checkoutItems.map((item) => {
        const unitPrice = item.product?.price || 0
        return {
          order_id: orderInsert.id,
          product_id: item.productId,
          product_name: item.product?.name || 'Unknown product',
          unit_price: unitPrice,
          quantity: item.quantity,
          line_total: unitPrice * item.quantity,
        }
      })

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload)

      if (itemsError) {
        console.error('Error creating order items', itemsError)
        if (showToast) {
          showToast('Failed to save order items. Please try again.', 'error')
        }
        return
      }

      if (showToast) {
        showToast('Order placed successfully. You can track it in Orders & Tracking.', 'success')
      }
      if (onOrderPlaced) {
        onOrderPlaced()
      }
      if (onNavigate) {
        onNavigate('orders')
      }
    } catch (err) {
      console.error('Unexpected error placing order', err)
      if (showToast) {
        showToast('Something went wrong. Please try again.', 'error')
      }
    }
  }

  const handleChangeAddress = () => {
    if (onNavigate) {
      onNavigate('profile')
    }
  }

  const handleSelectVoucher = () => {
    if (showToast) {
      showToast('Voucher selection will be available soon (demo only).', 'info')
    }
  }

  const handleChangePayment = () => {
    if (showToast) {
      showToast('Payment method change will be available soon (demo only).', 'info')
    }
  }

  return (
    <main className="customer-module checkout-page">
      <section className="checkout-section">
        <div className="checkout-card full">
          <p className="section-eyebrow">Delivery address</p>
          {profileAddress ? (
            <>
              <h2>
                {profileAddress.name}
                {profileAddress.phone && ` (${profileAddress.phone})`}
              </h2>
              {profileAddress.address ? (
                <p>{profileAddress.address}</p>
              ) : (
                <p>Please add your default delivery address in your Profile.</p>
              )}
            </>
          ) : (
            <p>{isLoadingProfile ? 'Loading your address...' : 'No address on file yet.'}</p>
          )}
          <button type="button" className="link-btn subtle" onClick={handleChangeAddress}>
            Change
          </button>
        </div>

        <div className="products-card">
          <h3>Products Ordered</h3>
          <article className="merchant-block">
            {checkoutItems.map((item) => {
              const product = item.product

              if (!product) {
                return null
              }

              return (
                <div className="checkout-row" key={item.productId}>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <small>
                        Variation: {product.badge} • Qty {item.quantity}
                      </small>
                    </div>
                  </div>
                  <div>₱{product.price}</div>
                  <div>{item.quantity}</div>
                  <div>₱{product.price * item.quantity}</div>
                </div>
              )
            })}
          </article>
        </div>

        <div className="checkout-card">
          <h3>Shop voucher</h3>
          <button type="button" className="link-btn subtle" onClick={handleSelectVoucher}>
            Select Voucher
          </button>
        </div>

        <div className="checkout-card">
          <h3>Shopee Coins</h3>
          <small>Coins cannot be redeemed</small>
        </div>

        <div className="payment-summary">
          <div>
            <h3>Payment Method</h3>
            <p>Cash on Delivery</p>
            <button type="button" className="link-btn subtle" onClick={handleChangePayment}>
              Change
            </button>
          </div>
          <div className="totals">
            <div>
              <span>Merchandise Subtotal</span>
              <strong>₱{subtotal}</strong>
            </div>
            <div>
              <span>Shipping Subtotal</span>
              <strong>₱{shippingFee}</strong>
            </div>
            <div className="checkout-summary__total">
              <span>Total Payment</span>
              <strong>₱{subtotal + shippingFee}</strong>
            </div>
          </div>
          <button type="button" className="checkout-btn wide" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </section>
    </main>
  )
}

export default CheckoutPage

