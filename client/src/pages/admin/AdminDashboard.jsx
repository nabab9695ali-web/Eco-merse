import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Truck,
  Plus,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { apiRequest } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest('/admin/stats');
        if (res.success) setStats(res.stats);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Admin Portal analytics...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Store Management
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Admin Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            <Package size={16} /> Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            <Truck size={16} /> Manage Orders
          </Link>
          <Link to="/admin/coupons" className="btn btn-secondary btn-sm">
            <Tag size={16} /> Discount Coupons
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Total Revenue */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Revenue</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
            ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Across paid customer orders</p>
        </div>

        {/* Total Orders */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Orders</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--secondary)' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--secondary)' }}>
            {stats?.totalOrders || 0}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {stats?.pendingOrders || 0} pending • {stats?.deliveredOrders || 0} delivered
          </p>
        </div>

        {/* Active Products */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Catalog</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
              <Package size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f59e0b' }}>
            {stats?.totalProducts || 0}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Products listed in store</p>
        </div>

        {/* Registered Users */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Registered Users</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
              <Users size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#06b6d4' }}>
            {stats?.totalUsers || 0}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Customers and sellers</p>
        </div>

      </div>

      {/* Grid: Recent Orders & Inventory Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }} className="admin-grid">
        
        {/* Recent Orders Table */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All Orders →
            </Link>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 8px' }}>Order ID</th>
                    <th style={{ padding: '10px 8px' }}>Customer</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>
                        <Link to={`/order/${order._id}`} style={{ color: 'var(--primary)' }}>
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{order.user?.name || order.shippingAddress?.fullName}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="badge badge-eco" style={{ fontSize: '0.7rem' }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 800 }}>
                        ₹{order.totalPrice?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No recent orders.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Low Inventory Alert</h2>
          </div>

          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.lowStockProducts.map((p) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card-subtle)' }}>
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                      Only {p.stock} units left!
                    </span>
                  </div>
                  <Link to="/admin/products" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--primary)' }}>
              <CheckCircle2 size={32} style={{ margin: '0 auto 6px' }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>All products well-stocked!</p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
