import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Tag, CheckCircle2, X } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/Toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 20,
    minOrderAmount: 999,
    maxDiscount: 2000,
  });

  const { showToast } = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/coupons');
      if (res.success) setCoupons(res.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await apiRequest(`/coupons/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast(`Coupon ${code} removed`, 'success');
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete coupon', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/coupons', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (res.success) {
        showToast('Coupon created successfully!', 'success');
        setCoupons((prev) => [res.coupon, ...prev]);
        setModalOpen(false);
        setFormData({ code: '', discountPercent: 20, minOrderAmount: 999, maxDiscount: 2000 });
      }
    } catch (err) {
      showToast(err.message || 'Failed to create coupon', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Link to="/admin" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <ChevronLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Discount & Promo Codes</h1>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No active promo codes.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Code</th>
                  <th style={{ padding: '12px 16px' }}>Discount %</th>
                  <th style={{ padding: '12px 16px' }}>Min Order Amount</th>
                  <th style={{ padding: '12px 16px' }}>Max Cap (₹)</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-eco" style={{ fontSize: '0.85rem' }}>{c.code}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>
                      {c.discountPercent}% OFF
                    </td>
                    <td style={{ padding: '12px 16px' }}>₹{c.minOrderAmount || 0}</td>
                    <td style={{ padding: '12px 16px' }}>₹{c.maxDiscount || 5000}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Active</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(c._id, c.code)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '32px', height: '32px', color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '2rem',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--bg-card-subtle)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem' }}>Create Promo Code</h2>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. FLASH30"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount Percentage (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    max="90"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Min Order (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <span>Activate Coupon</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
