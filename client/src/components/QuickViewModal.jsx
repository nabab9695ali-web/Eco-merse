import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Check, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export default function QuickViewModal({ product, onClose }) {
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { showToast } = useToast();

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedQty);
    showToast(`Added ${selectedQty}x "${product.name}" to bag!`, 'success');
    onClose();
  };

  return (
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
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '840px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: 'var(--text-main)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '2rem' }}>
          
          {/* Gallery Column */}
          <div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '320px', background: 'var(--bg-card-subtle)', marginBottom: '1rem' }}>
              <img
                src={product.images && product.images[activeImageIndex] ? product.images[activeImageIndex] : product.images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      border: `2px solid ${activeImageIndex === idx ? 'var(--primary)' : 'transparent'}`,
                      overflow: 'hidden',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <span className="badge badge-eco">{product.category}</span>
                {product.isEcoChoice && (
                  <span className="badge badge-featured">
                    <Leaf size={12} /> Sustainable
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                {product.name}
              </h2>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(product.rating || 5) ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{product.rating || 5.0}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({product.numReviews || 0} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {product.discountPrice > 0 && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                    style={{ padding: '8px 14px', background: 'var(--bg-card-subtle)', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 16px', fontWeight: 700, fontSize: '0.95rem' }}>
                    {selectedQty}
                  </span>
                  <button
                    onClick={() => setSelectedQty((q) => Math.min(product.stock || 10, q + 1))}
                    style={{ padding: '8px 14px', background: 'var(--bg-card-subtle)', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem 1.5rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '46px', height: '46px' }}
                >
                  <Heart size={20} color={isWishlisted ? '#f43f5e' : 'currentColor'} fill={isWishlisted ? '#f43f5e' : 'none'} />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Truck size={16} color="var(--primary)" />
                  <span>Dispatched in 24 Hours</span>
                </div>
                <Link
                  to={`/product/${product.slug || product._id}`}
                  onClick={onClose}
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  View Full Details →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
