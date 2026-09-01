import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    tag: 'Sustainable Revolution',
    title: 'Mindful Living, Elevated Design.',
    subtitle: 'Discover curated electronics, organic home decor, and certified cruelty-free essentials crafted for the modern conscious lifestyle.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    primaryBtnText: 'Shop New Arrivals',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'Explore Eco Choice',
    secondaryBtnLink: '/shop?eco=true',
    badge: '🌿 100% Biodegradable & Recycled',
  },
  {
    tag: 'Exclusive Spring Drop',
    title: 'Clean Audio. Zero Footprint.',
    subtitle: 'Handcrafted bamboo acoustic chambers paired with active noise cancellation and solar re-charging.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80',
    primaryBtnText: 'Claim 20% Off (Code: ECO20)',
    primaryBtnLink: '/shop?category=Electronics+%26+Audio',
    secondaryBtnText: 'View Specs',
    secondaryBtnLink: '/shop',
    badge: '⚡ 40-Hour Battery Life',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginTop: '1.5rem',
        marginBottom: '3rem',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Background Image with Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.8s ease-in-out',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(90deg, var(--bg-main) 0%, rgba(15, 23, 42, 0.85) 55%, rgba(15, 23, 42, 0.4) 100%)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '640px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>
            <Sparkles size={16} />
            <span>{slide.badge}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            {slide.title}
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: '#cbd5e1',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            {slide.subtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Link to={slide.primaryBtnLink} className="btn btn-primary btn-lg">
              <span>{slide.primaryBtnText}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to={slide.secondaryBtnLink}
              className="btn btn-secondary btn-lg"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', backdropFilter: 'blur(8px)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <span>{slide.secondaryBtnText}</span>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <div>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>10,000+</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Happy Customers</p>
            </div>
            <div>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>100%</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Carbon Offset</p>
            </div>
            <div>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>4.9 ★</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Certified Reviews</p>
            </div>
          </div>

        </div>
      </div>

      {/* Slide Navigation controls */}
      <div style={{ position: 'absolute', bottom: '20px', right: '24px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
