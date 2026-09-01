import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Flame, ArrowRight, ShieldCheck, Leaf, Star, Clock } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { apiRequest } from '../utils/api';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [ecoProducts, setEcoProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          apiRequest('/categories'),
          apiRequest('/products/featured'),
        ]);

        if (catRes.success) setCategories(catRes.categories);
        if (prodRes.success) {
          setFeaturedProducts(prodRes.featured || []);
          setDealsProducts(prodRes.deals || []);
          setEcoProducts(prodRes.ecoFriendly || []);
        }
      } catch (err) {
        console.error('Home data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Categories Grid */}
      <CategorySlider categories={categories} />

      {/* Flash Deals / Special Offers with Live Countdown */}
      <section style={{ marginBottom: '4rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(245, 158, 11, 0.08))',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                <Flame size={18} fill="#f43f5e" /> Limited Time Flash Sale
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Deals of the Day</h2>
            </div>

            {/* Countdown Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginRight: '6px' }}>
                <Clock size={16} /> Ends in:
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#f43f5e' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span style={{ fontWeight: 800, alignSelf: 'center' }}>:</span>
                <div style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#f43f5e' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span style={{ fontWeight: 800, alignSelf: 'center' }}>:</span>
                <div style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#f43f5e' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {dealsProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Handpicked Quality
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Products</h2>
          </div>
          <Link to="/shop" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
            View All Products →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Sustainable Spotlight Banner */}
      <section
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          color: '#ffffff',
          padding: '3.5rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '4rem',
          boxShadow: '0 20px 30px -10px rgba(6, 78, 59, 0.4)',
        }}
      >
        <div style={{ maxWidth: '600px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Leaf size={16} /> Eco Pledge 2026
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem', color: '#fff' }}>
            Every Purchase Plants a Tree & Cleans the Oceans.
          </h2>
          <p style={{ fontSize: '1rem', color: '#d1fae5', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            We partner with certified non-profit reforestation projects. 1% of your order value goes directly toward carbon offset and ocean plastic removal.
          </p>
          <Link
            to="/shop?eco=true"
            className="btn btn-primary"
            style={{ background: '#ffffff', color: '#064e3b', fontWeight: 700, padding: '0.85rem 1.8rem', fontSize: '1rem' }}
          >
            <span>Shop Certified Eco Picks</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
