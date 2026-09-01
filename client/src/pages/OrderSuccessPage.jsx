import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Home, FileText } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiRequest(`/orders/${id}`);
        if (res.success) setOrder(res.order);
      } catch (err) {
        console.error('Error fetching order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="glass-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease-out',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <CheckCircle2 size={46} />
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.75rem' }}>
          Thank you for choosing conscious, sustainable shopping. We are preparing your package!
        </p>

        {/* Order Details Card */}
        <div
          style={{
            background: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Number</span>
              <p style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>{order?.orderNumber || id}</p>
            </div>
            <span className="badge badge-eco" style={{ fontSize: '0.8rem' }}>
              {order?.status || 'Processing'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Delivery</span>
              <p style={{ fontWeight: 700 }}>Within 3 - 5 Business Days</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Method</span>
              <p style={{ fontWeight: 700 }}>{order?.paymentMethod || 'UPI / Online'}</p>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shipping To</span>
              <p style={{ fontWeight: 600 }}>
                {order?.shippingAddress?.fullName}, {order?.shippingAddress?.street}, {order?.shippingAddress?.city} ({order?.shippingAddress?.postalCode})
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <Link to={`/order/${id}`} className="btn btn-primary btn-lg">
            <Truck size={18} />
            <span>Track Order Status</span>
          </Link>

          <Link to="/shop" className="btn btn-secondary btn-lg">
            <Home size={18} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
