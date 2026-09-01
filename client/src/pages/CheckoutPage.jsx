import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  QrCode,
  Smartphone,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { apiRequest } from '../utils/api';

export default function CheckoutPage() {
  const { user } = useAuth();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    coupon,
    totalPrice,
    clearCart,
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Form State
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || 'Nabab Ali',
    phone: user?.phone || '+91 9695000000',
    street: user?.addresses?.[0]?.street || '124 Green Park Avenue',
    city: user?.addresses?.[0]?.city || 'New Delhi',
    state: user?.addresses?.[0]?.state || 'Delhi',
    postalCode: user?.addresses?.[0]?.postalCode || '110016',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please login to place your order', 'warning');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!shippingData.fullName || !shippingData.street || !shippingData.city || !shippingData.postalCode) {
      showToast('Please fill all required shipping address fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount,
        couponCode: coupon?.code || '',
        totalPrice,
      };

      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      if (res.success && res.order) {
        // Trigger celebratory confetti fireworks!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b'],
        });

        clearCart();
        showToast('Order placed successfully!', 'success');
        navigate(`/order-success/${res.order._id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Express Checkout</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Review your shipping information and complete your secure order
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'start' }} className="checkout-layout">
          
          {/* Left Column: Shipping & Payment Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Step 1: Shipping Address */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  1
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Shipping & Delivery Address</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 1' }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 1' }}>
                  <label className="form-label">Mobile Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Street Address & Flat / House No. *</label>
                  <input
                    type="text"
                    name="street"
                    className="form-input"
                    value={shippingData.street}
                    onChange={handleInputChange}
                    placeholder="e.g. 124 Green Park Avenue, Near Metro"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="form-input"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-input"
                    value={shippingData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-input"
                    value={shippingData.country}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  2
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Payment Method</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* UPI Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'UPI' ? 'var(--primary-light)' : 'var(--bg-card-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>UPI / QR Instant Pay</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <Smartphone size={22} color="var(--primary)" />
                </label>

                {/* Card Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'Card' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'Card' ? 'var(--primary-light)' : 'var(--bg-card-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Credit / Debit Card</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay</p>
                    </div>
                  </div>
                  <CreditCard size={22} color="var(--secondary)" />
                </label>

                {/* Cash on Delivery */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'Cash on Delivery' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === 'Cash on Delivery' ? 'var(--primary-light)' : 'var(--bg-card-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay cash or UPI at your doorstep</p>
                    </div>
                  </div>
                  <Truck size={22} color="#f59e0b" />
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Place Order */}
          <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Review</h2>

            {/* Items Mini List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '4px' }}>
              {cartItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      Qty: {item.qty} × ₹{item.price}
                    </p>
                  </div>
                  <span style={{ fontWeight: 700 }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Financials Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                <span style={{ color: shippingPrice === 0 ? 'var(--primary)' : 'inherit', fontWeight: 700 }}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                <span>₹{taxPrice.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700 }}>
                  <span>Discount ({coupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>Final Total</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', gap: '8px' }}
            >
              <Lock size={18} />
              <span>{loading ? 'Processing Order...' : `Place Order (₹${totalPrice.toLocaleString('en-IN')})`}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--primary)" />
              <span>100% Buyer Protection & Easy Refund</span>
            </div>
          </div>

        </div>
      </form>

      <style>{`
        @media (max-width: 860px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
