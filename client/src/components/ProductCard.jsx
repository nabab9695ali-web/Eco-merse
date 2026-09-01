import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Eye, ShoppingBag, Leaf, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { showToast } = useToast();

  const isWishlisted = isInWishlist(product._id);
  const discountPercent =
    product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      showToast('Sorry, this product is currently out of stock', 'warning');
      return;
    }
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!',
      isWishlisted ? 'warning' : 'success'
    );
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Product Image Container */}
      <div
        style={{
          position: 'relative',
          paddingTop: '90%',
          overflow: 'hidden',
          background: 'var(--bg-card-subtle)',
        }}
      >
        <Link to={`/product/${product.slug || product._id}`}>
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </Link>

        {/* Badges Stack */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {discountPercent > 0 && (
            <span className="badge badge-discount">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isEcoChoice && (
            <span className="badge badge-eco">
              <Leaf size={11} /> Eco Choice
            </span>
          )}
        </div>

        {/* Action Buttons Float (Wishlist & Quick View) */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 2,
          }}
        >
          <button
            onClick={handleToggleWishlist}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'transform 0.2s',
            }}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Heart size={16} color={isWishlisted ? '#f43f5e' : 'var(--text-muted)'} fill={isWishlisted ? '#f43f5e' : 'none'} />
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickView}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-muted)',
                transition: 'transform 0.2s',
              }}
              title="Quick Preview"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category & Rating */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontWeight: 700 }}>
              <Star size={13} fill="#f59e0b" />
              <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>({product.numReviews || 0})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                lineHeight: 1.35,
                color: 'var(--text-main)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price Tag & Stock status */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {product.discountPrice > 0 && (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Stock hint if low */}
          {product.stock <= 5 && product.stock > 0 && (
            <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginBottom: '0.6rem' }}>
              ⚡ Only {product.stock} left in stock!
            </p>
          )}

          {product.stock === 0 && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, marginBottom: '0.6rem' }}>
              ✕ Out of stock
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.6rem',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-md)',
              opacity: product.stock <= 0 ? 0.6 : 1,
            }}
          >
            <ShoppingBag size={16} />
            <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
