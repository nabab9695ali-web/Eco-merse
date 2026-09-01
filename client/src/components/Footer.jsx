import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Truck, RotateCcw, Heart, Send } from 'lucide-react';
import { useToast } from './Toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to EcoMerse Newsletter!', 'success');
      setEmail('');
    }
  };

  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', marginTop: '4rem', paddingTop: '3.5rem', paddingBottom: '2rem' }}>
      {/* Value Badges Banner */}
      <div className="container" style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          padding: '1.5rem',
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>Carbon-Neutral Delivery</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Free on orders above ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--secondary)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>100% Genuine & Eco-Safe</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Certified organic & non-toxic</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>7 Days Easy Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant refund guarantee</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
              <Leaf size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem' }}>Zero-Plastic Packaging</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compostable & biodegradable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
        
        {/* Brand Column */}
        <div style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Leaf size={20} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>Eco<span style={{ color: 'var(--primary)' }}>merse</span></span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Empowering mindful consumerism. Discover ethically sourced, premium and sustainable products curated for modern life.
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
            Developed by <strong>Nabab Ali</strong>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Shop Categories</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li><Link to="/shop?category=Electronics+%26+Audio" style={{ transition: 'color 0.2s' }}>Electronics & Audio</Link></li>
            <li><Link to="/shop?category=Eco+Home+%26+Living">Eco Home & Living</Link></li>
            <li><Link to="/shop?category=Fashion+%26+Apparel">Fashion & Apparel</Link></li>
            <li><Link to="/shop?category=Organic+Beauty+%26+Wellness">Organic Beauty & Wellness</Link></li>
            <li><Link to="/shop?category=Fitness+%26+Outdoors">Fitness & Outdoors</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Customer Care</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li><Link to="/profile?tab=orders">Track Your Order</Link></li>
            <li><Link to="/cart">My Shopping Bag</Link></li>
            <li><Link to="/wishlist">Saved Wishlist</Link></li>
            <li><Link to="/profile">Manage Addresses</Link></li>
            <li><a href="mailto:nabab9695ali@gmail.com">Help & Support</a></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Stay Connected</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Get ₹500 off on your first order + early access to sustainable drops.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="email"
              placeholder="Your email address"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.6rem 0.9rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Copyright & Credits */}
      <div className="container" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <div>
          © {new Date().getFullYear()} EcoMerse Platform. Designed & Built with <Heart size={13} color="#f43f5e" fill="#f43f5e" style={{ display: 'inline', verticalAlign: 'middle' }} /> by <strong>Nabab Ali</strong> (nabab9695ali@gmail.com).
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security & SSL</span>
        </div>
      </div>
    </footer>
  );
}
