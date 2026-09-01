import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      if (item.stock > 0) addToCart(item, 1);
    });
    showToast(`Moved ${wishlist.length} items to bag!`, 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            padding: '3.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.12)',
              color: '#f43f5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Heart size={34} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Save items you love by tapping the heart icon on any product card.
          </p>

          <Link to="/shop" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>
            <span>Explore Collection</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Saved Wishlist</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved for later
          </p>
        </div>

        <button onClick={handleMoveAllToCart} className="btn btn-primary">
          <ShoppingBag size={18} />
          <span>Move All to Bag</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
