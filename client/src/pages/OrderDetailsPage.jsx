import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ChevronLeft,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { apiRequest } from '../utils/api';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiRequest(`/orders/${id}`);
        if (res.success) setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading order tracker...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Order Not Found</h2>
        <Link to="/profile?tab=orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status) !== -1 ? statusSteps.indexOf(order.status) : 1;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Back button */}
      <Link to="/profile?tab=orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ChevronLeft size={16} /> Back to My Orders
      </Link>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Tracker</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>{order.orderNumber}</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span
            className={`badge ${
              order.status === 'Delivered'
                ? 'badge-eco'
                : order.status === 'Cancelled'
                ? 'badge-discount'
                : 'badge-featured'
            }`}
            style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Shipment Progress</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
          {statusSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step} style={{ textAlign: 'center', position: 'relative' }}>
                {/* Step Circle */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--primary)' : 'var(--bg-card-subtle)',
                    border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--border-color)'}`,
                    color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontWeight: 800,
                    zIndex: 2,
                    position: 'relative',
                    boxShadow: isCurrent ? '0 0 15px var(--primary-glow)' : 'none',
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                </div>

                <p style={{ fontSize: '0.9rem', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {step}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tracking Logs List */}
        {order.trackingHistory && order.trackingHistory.length > 0 && (
          <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Tracking History Updates</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.trackingHistory.slice().reverse().map((log, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.88rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
                  <div>
                    <span style={{ fontWeight: 700 }}>{log.status}:</span> <span>{log.message}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items & Shipping Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }} className="order-layout">
        
        {/* Ordered Items */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Items in this Shipment</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.orderItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Delivery Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Shipping Address */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <MapPin size={18} color="var(--primary)" /> Delivery Address
            </h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{order.shippingAddress.fullName}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '4px' }}>
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Phone: {order.shippingAddress.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <CreditCard size={18} color="var(--secondary)" /> Payment Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                <span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST</span>
                <span>₹{order.taxPrice?.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700 }}>
                  <span>Discount</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.3rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                <span>Paid Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '8px 12px', background: order.isPaid ? 'var(--primary-light)' : 'rgba(245, 158, 11, 0.12)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: order.isPaid ? 'var(--primary)' : '#f59e0b', textAlign: 'center' }}>
              {order.isPaid ? '✓ Payment Received & Verified' : 'Payment on Delivery'}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .order-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
