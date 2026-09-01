import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Truck, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/Toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' ? '/orders' : `/orders?status=${statusFilter}`;
      const res = await apiRequest(url);
      if (res.success) setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, note: `Status manually updated by Admin to ${newStatus}` }),
      });
      if (res.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        setOrders((prev) => prev.map((o) => (o._id === orderId ? res.order : o)));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Link to="/admin" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <ChevronLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Customer Orders & Shipments</h1>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found for this filter.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Order Number</th>
                  <th style={{ padding: '12px 16px' }}>Customer & Destination</th>
                  <th style={{ padding: '12px 16px' }}>Items</th>
                  <th style={{ padding: '12px 16px' }}>Total & Payment</th>
                  <th style={{ padding: '12px 16px' }}>Shipment Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                      <Link to={`/order/${order._id}`} style={{ color: 'var(--primary)' }}>
                        {order.orderNumber}
                      </Link>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontWeight: 700 }}>{order.shippingAddress?.fullName}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} ({order.shippingAddress?.postalCode})
                      </p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 600 }}>{order.orderItems?.length} items</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{order.totalPrice?.toLocaleString('en-IN')}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: order.isPaid ? 'var(--primary)' : '#f59e0b', fontWeight: 700 }}>
                        {order.isPaid ? '✓ Paid' : 'COD / Unpaid'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.82rem', width: 'auto', fontWeight: 600 }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Link to={`/order/${order._id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
