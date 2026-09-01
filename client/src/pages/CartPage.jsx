import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  Leaf,
  Check,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);

    if (res.success) {
      showToast(`Coupon "${res.coupon.code}" applied: ${res.coupon.discountPercent}% OFF!`, 'success');
      setCouponInput('');
    } else {
      showToast(res.message || 'Invalid coupon code', 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            padding: '3.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Your Bag is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '380px' }}>
            Looks like you haven't added any sustainable items yet. Explore our curated eco collections today!
          </p>

          <Link to="/shop" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>
            <span>Explore Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Shopping Bag</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {cartItems.reduce((sum, item) => sum + item.qty, 0)} items in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Trash2 size={15} /> Clear All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }} className="cart-layout">
        
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass-card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Product Image */}
              <Link to={`/product/${item.product}`}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'}
                  alt={item.name}
                  style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', background: 'var(--bg-card-subtle)' }}
                />
              </Link>

              {/* Title & Info */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.category}
                </span>
                <Link to={`/product/${item.product}`}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                    {item.name}
                  </h3>
                </Link>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <button
                  onClick={() => updateQty(item.product, item.qty - 1)}
                  style={{ padding: '6px 12px', background: 'var(--bg-card-subtle)', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ padding: '0 14px', fontWeight: 800, fontSize: '0.95rem' }}>
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.product, item.qty + 1)}
                  style={{ padding: '6px 12px', background: 'var(--bg-card-subtle)', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontWeight: 700 }}
                >
                  +
                </button>
              </div>

              {/* Line Total */}
              <div style={{ fontSize: '1.1rem', fontWeight: 900, minWidth: '90px', textAlign: 'right' }}>
                ₹{(item.price * item.qty).toLocaleString('en-IN')}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromCart(item.product)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                title="Remove item"
              >
                <Trash2 size={18} color="#ef4444" />
              </button>
            </div>
          ))}

          {/* Shipping Free Progress Bar */}
          <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-card-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
              <Truck size={18} color="var(--primary)" />
              {itemsPrice >= 999 ? (
                <span style={{ color: 'var(--primary)' }}>🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
              ) : (
                <span>Add <strong>₹{(999 - itemsPrice).toLocaleString('en-IN')}</strong> more to get FREE Express Delivery!</span>
              )}
            </div>
            <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--primary)',
                  width: `${Math.min(100, (itemsPrice / 999) * 100)}%`,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Promo Code & Order Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Coupon / Promo Box */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={16} color="var(--primary)" /> Apply Discount Code
            </h3>

            {coupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>{coupon.code}</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{coupon.discountPercent}% Discount applied</p>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}
                  title="Remove coupon"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. ECO20, NABAB50"
                  className="form-input"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0 1rem' }}
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}

            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCouponInput('ECO20')}
                style={{ background: 'var(--bg-card-subtle)', border: '1px dashed var(--border-color)', borderRadius: '6px', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: 'var(--primary)' }}
              >
                ECO20 (20% OFF)
              </button>
              <button
                type="button"
                onClick={() => setCouponInput('NABAB50')}
                style={{ background: 'var(--bg-card-subtle)', border: '1px dashed var(--border-color)', borderRadius: '6px', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: 'var(--secondary)' }}
              >
                NABAB50 (50% OFF)
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 700 }}>₹{itemsPrice.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                <span style={{ fontWeight: 700, color: shippingPrice === 0 ? 'var(--primary)' : 'inherit' }}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated GST (5%)</span>
                <span style={{ fontWeight: 700 }}>₹{taxPrice.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                  <span>Coupon Discount</span>
                  <span style={{ fontWeight: 800 }}>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Amount</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--primary)" />
              <span>Safe & 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
