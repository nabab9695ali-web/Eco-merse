import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Home, Shirt, Sparkles, Activity, Package } from 'lucide-react';

const iconMap = {
  Headphones: Headphones,
  Home: Home,
  Shirt: Shirt,
  Sparkles: Sparkles,
  Activity: Activity,
};

export default function CategorySlider({ categories = [] }) {
  return (
    <section style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Featured Collections
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Explore by Category</h2>
        </div>
        <Link to="/shop" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
          Browse All Categories →
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Package;

          return (
            <Link
              key={cat._id || cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="glass-card"
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%), url(${cat.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComponent size={20} color="#ffffff" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                  {cat.itemCount ? `${cat.itemCount} Items` : 'Explore Collection'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
