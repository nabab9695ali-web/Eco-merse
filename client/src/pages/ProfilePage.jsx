import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Lock,
  Edit2,
  Plus,
  Trash2,
  Truck,
  Calendar,
  CheckCircle2,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { apiRequest } from '../utils/api';

export default function ProfilePage() {
  const { user, updateProfile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'profile';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    password: '',
    confirmPassword: '',
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Fetch orders
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await apiRequest('/orders/myorders');
          if (res.success) setOrders(res.orders);
        } catch (err) {
          console.error('Failed to load user orders', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar,
      };
      if (formData.password) payload.password = formData.password;

      await updateProfile(payload);
      showToast('Profile updated successfully!', 'success');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Header Info */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-subtle) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user?.name}</h1>
              {isAdmin && <span className="badge badge-featured">Admin Portal</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
            {user?.phone && <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>{user.phone}</p>}
          </div>
        </div>

        {isAdmin && (
          <Link to="/admin" className="btn btn-primary">
            <LayoutDashboard size={18} />
            <span>Open Admin Dashboard</span>
          </Link>
        )}
      </div>

      {/* Profile Tabs & Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }} className="profile-layout">
        
        {/* Navigation Sidebar */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => setSearchParams({ tab: 'profile' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'profile' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: activeTab === 'profile' ? 700 : 500,
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.92rem',
            }}
          >
            <User size={18} /> Personal Info
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'orders' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'orders' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.92rem',
            }}
          >
            <Package size={18} /> Order History
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Personal Information</h2>

              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Avatar Image URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password (Optional)</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Leave blank to keep current"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', padding: '0.8rem 1.8rem' }}
                >
                  <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Order History</h2>

              {loadingOrders ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No orders placed yet.</p>
                  <Link to="/shop" className="btn btn-primary btn-sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      style={{
                        padding: '1.25rem',
                        background: 'var(--bg-card-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{order.orderNumber}</span>
                          <span className="badge badge-eco" style={{ fontSize: '0.7rem' }}>{order.status}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} • {order.orderItems?.length} items
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount</span>
                          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                            ₹{order.totalPrice?.toLocaleString('en-IN')}
                          </p>
                        </div>

                        <Link to={`/order/${order._id}`} className="btn btn-secondary btn-sm">
                          <Truck size={15} />
                          <span>Track</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
