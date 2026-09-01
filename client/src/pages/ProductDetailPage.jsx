import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Leaf,
  ChevronRight,
  Send,
  Check,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';
import { apiRequest } from '../utils/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/products/${id}`);
        if (res.success) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
          setActiveImageIndex(0);
          setSelectedQty(1);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem',
          }}
        />
        <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent =
    product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, selectedQty);
    showToast(`Added ${selectedQty}x "${product.name}" to your bag!`, 'success');
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, selectedQty);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to leave a review', 'warning');
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await apiRequest(`/products/${product._id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment, title: reviewTitle }),
      });

      if (res.success) {
        showToast('Review submitted successfully!', 'success');
        setProduct(res.product);
        setComment('');
        setReviewTitle('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container" style={{ padding: '1.5rem 1.5rem 4rem' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop">Shop</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        
        {/* Left Column: Image Gallery */}
        <div>
          {/* Main Large Image */}
          <div
            className="glass-card"
            style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              height: '460px',
              position: 'relative',
              marginBottom: '1rem',
              background: 'var(--bg-card-subtle)',
            }}
          >
            <img
              src={product.images && product.images[activeImageIndex] ? product.images[activeImageIndex] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Badges Float */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {discountPercent > 0 && <span className="badge badge-discount">-{discountPercent}% OFF</span>}
              {product.isEcoChoice && <span className="badge badge-eco"><Leaf size={12} /> 100% Sustainable</span>}
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${activeImageIndex === idx ? 'var(--primary)' : 'var(--border-color)'}`,
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'var(--bg-card)',
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.brand} • {product.category}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Product link copied to clipboard!', 'success');
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating || 5) ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.numReviews || 0} Customer Reviews</span>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '1.5rem', background: 'var(--bg-card-subtle)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {product.discountPrice > 0 && (
                <>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="badge badge-discount">
                    Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')} ({discountPercent}%)
                  </span>
                </>
              )}
            </div>

            {/* Description Summary */}
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Stock Availability */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
              {product.stock > 0 ? (
                <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={18} /> In Stock & Ready to Ship ({product.stock} units available)
                </span>
              ) : (
                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={18} /> Out of Stock (Restocking soon)
                </span>
              )}
            </div>

            {/* Quantity & Cart Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
              {/* Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <button
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  style={{ padding: '12px 18px', background: 'var(--bg-card-subtle)', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ padding: '0 20px', fontWeight: 800, fontSize: '1.1rem' }}>
                  {selectedQty}
                </span>
                <button
                  onClick={() => setSelectedQty((q) => Math.min(product.stock || 10, q + 1))}
                  style={{ padding: '12px 18px', background: 'var(--bg-card-subtle)', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn btn-secondary btn-lg"
                style={{ flex: 1, minWidth: '160px' }}
              >
                <ShoppingBag size={20} />
                <span>Add to Bag</span>
              </button>

              {/* Buy Now Direct Checkout */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, minWidth: '160px' }}
              >
                <span>Buy Now</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  toggleWishlist(product);
                  showToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
                }}
                className="btn btn-secondary btn-icon"
                style={{ width: '52px', height: '52px' }}
              >
                <Heart size={22} color={isWishlisted ? '#f43f5e' : 'currentColor'} fill={isWishlisted ? '#f43f5e' : 'none'} />
              </button>
            </div>

            {/* Value Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.25rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div>
                <Truck size={20} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Free Express</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Over ₹999</p>
              </div>
              <div>
                <ShieldCheck size={20} color="var(--secondary)" style={{ margin: '0 auto 4px' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Authentic</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>100% Certified</p>
              </div>
              <div>
                <RotateCcw size={20} color="#f59e0b" style={{ margin: '0 auto 4px' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>7 Days Return</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hassle Free</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Product Details Tabs (Specs / Sustainability / Reviews) */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: activeTab === 'specs' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'specs' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              paddingBottom: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Specifications & Details
          </button>
          <button
            onClick={() => setActiveTab('eco')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: activeTab === 'eco' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'eco' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              paddingBottom: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Sustainability & Eco Impact
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'reviews' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              paddingBottom: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Customer Reviews ({product.reviews ? product.reviews.length : 0})
          </button>
        </div>

        {/* Tab 1: Specs */}
        {activeTab === 'specs' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Technical Specifications</h3>
            {product.specifications && product.specifications.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {product.specifications.map((spec, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{spec.key}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No additional specifications listed for this product.</p>
            )}
          </div>
        )}

        {/* Tab 2: Eco Impact */}
        {activeTab === 'eco' && (
          <div style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Eco Commitment & Zero Plastic</h3>
            <p style={{ marginBottom: '1rem' }}>
              Every unit of <strong>{product.name}</strong> is manufactured under ethical labor guidelines and packaged exclusively in FSC-certified recycled unbleached cardboard with water-based soy ink.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <div style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                ✓ 100% Recyclable Materials
              </div>
              <div style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                ✓ Zero Single-Use Plastics
              </div>
              <div style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                ✓ 1% Donated to Clean Oceans
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              
              {/* Reviews List */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  Verified Reviews ({product.reviews ? product.reviews.length : 0})
                </h3>

                {product.reviews && product.reviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {product.reviews.map((rev, idx) => (
                      <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700 }}>{rev.name}</span>
                          <div style={{ display: 'flex', color: '#f59e0b' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                            ))}
                          </div>
                        </div>
                        {rev.title && <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{rev.title}</h4>}
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to share your experience!</p>
                )}
              </div>

              {/* Submit Review Form */}
              <div style={{ background: 'var(--bg-card-subtle)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Write a Review</h3>

                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                        >
                          <Star size={24} fill={star <= rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Headline</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Excellent build quality and great sound"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Feedback</label>
                    <textarea
                      rows="4"
                      className="form-textarea"
                      placeholder="Share what you liked, product performance or materials..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Send size={16} />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              You Might Also Like
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Related Products</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
