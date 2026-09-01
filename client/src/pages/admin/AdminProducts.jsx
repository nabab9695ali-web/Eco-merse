import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Leaf,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/Toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    category: 'Electronics & Audio',
    brand: 'EcoMerse',
    stock: '15',
    description: '',
    shortDescription: '',
    images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    isEcoChoice: true,
    isFeatured: false,
    isBestSeller: false,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        apiRequest('/products?pageSize=100'),
        apiRequest('/categories'),
      ]);
      if (pRes.success) setProducts(pRes.products);
      if (cRes.success) setCategories(cRes.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      discountPrice: '',
      category: categories[0]?.name || 'Electronics & Audio',
      brand: 'EcoMerse',
      stock: '15',
      description: '',
      shortDescription: '',
      images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      isEcoChoice: true,
      isFeatured: false,
      isBestSeller: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: String(prod.price),
      discountPrice: String(prod.discountPrice || ''),
      category: prod.category,
      brand: prod.brand || 'EcoMerse',
      stock: String(prod.stock),
      description: prod.description,
      shortDescription: prod.shortDescription || '',
      images: prod.images?.join(', ') || '',
      isEcoChoice: Boolean(prod.isEcoChoice),
      isFeatured: Boolean(prod.isFeatured),
      isBestSeller: Boolean(prod.isBestSeller),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await apiRequest(`/products/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast(`Product "${name}" removed successfully`, 'success');
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const imageList = formData.images
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        description: formData.description,
        shortDescription: formData.shortDescription,
        images: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
        isEcoChoice: formData.isEcoChoice,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
      };

      if (editingProduct) {
        const res = await apiRequest(`/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (res.success) {
          showToast('Product updated successfully!', 'success');
          setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? res.product : p)));
          setModalOpen(false);
        }
      } else {
        const res = await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (res.success) {
          showToast('New product created successfully!', 'success');
          setProducts((prev) => [res.product, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Link to="/admin" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <ChevronLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Product Catalog Management</h1>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {filteredProducts.length} Products
        </span>
      </div>

      {/* Product Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Item</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Stock</th>
                  <th style={{ padding: '12px 16px' }}>Badges</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                          alt={prod.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>{prod.name}</p>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{prod.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600 }}>{prod.category}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                      ₹{(prod.discountPrice || prod.price).toLocaleString('en-IN')}
                      {prod.discountPrice > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textDecoration: 'line-through', marginLeft: '6px' }}>
                          ₹{prod.price}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: prod.stock <= 5 ? '#f59e0b' : 'var(--primary)' }}>
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {prod.isEcoChoice && <span className="badge badge-eco" style={{ fontSize: '0.65rem' }}>Eco</span>}
                        {prod.isFeatured && <span className="badge badge-featured" style={{ fontSize: '0.65rem' }}>Featured</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="btn btn-secondary btn-icon"
                          style={{ width: '34px', height: '34px' }}
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id, prod.name)}
                          className="btn btn-secondary btn-icon"
                          style={{ width: '34px', height: '34px', color: '#ef4444' }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
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
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              position: 'relative',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
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

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bamboo Noise Cancelling Earbuds"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Regular Price (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Price (₹) (Optional)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="Leave blank if no sale"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (Comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..., https://..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. 100% organic bamboo, 40h battery"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Description *</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isEcoChoice}
                    onChange={(e) => setFormData({ ...formData, isEcoChoice: e.target.checked })}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>🌿 Eco Certified</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>⭐ Featured</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <span>{saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
