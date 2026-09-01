import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Package,
  LogOut,
  ChevronDown,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { apiRequest } from '../utils/api';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemsCount, wishlist } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Live search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await apiRequest(`/products?keyword=${encodeURIComponent(searchQuery)}&pageSize=5`);
        if (res.success) {
          setSuggestions(res.products);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSuggestions(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Top Notification Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #059669, #10b981, #06b6d4)',
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: 600,
          padding: '6px 1rem',
          textAlign: 'center',
          letterSpacing: '0.02em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Leaf size={14} />
        <span>100% Eco-Friendly Certified • Free Shipping on orders over ₹999 • Use code <strong>ECO20</strong> for 20% OFF</span>
      </div>

      {/* Main Glass Navigation Bar */}
      <nav className="glass-nav" style={{ padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Leaf size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                Eco<span style={{ color: 'var(--primary)' }}>Commerce</span>
              </span>
            </div>
          </Link>

          {/* Search Bar with Live Suggestions (Desktop) */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '520px', position: 'relative', display: 'none', margin: '0 1rem' }} className="desktop-search">
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search eco products, audio, bamboo essentials..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                style={{
                  paddingLeft: '2.75rem',
                  paddingRight: '1rem',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                }}
              />
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  zIndex: 1010,
                }}
              >
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item.slug || item._id}`}
                    onClick={() => setShowSuggestions(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                        ₹{item.discountPrice || item.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-links">
            <Link to="/shop" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', transition: 'color 0.2s' }}>
              Explore Shop
            </Link>
            <Link to="/shop?eco=true" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={16} /> Eco Choices
            </Link>
          </div>

          {/* Nav Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-icon"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              style={{ width: '38px', height: '38px' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#f59e0b" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="btn btn-secondary btn-icon"
              style={{ position: 'relative', width: '38px', height: '38px' }}
              title="Your Wishlist"
            >
              <Heart size={18} color={wishlist.length > 0 ? '#f43f5e' : 'currentColor'} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#f43f5e',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="btn btn-primary"
              style={{
                position: 'relative',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShoppingBag size={18} />
              <span style={{ fontWeight: 700 }}>{itemsCount}</span>
            </Link>

            {/* User Account / Auth Dropdown */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 10px 4px 4px',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                  }}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)', gap: '6px' }}
                >
                  <User size={16} />
                  <span>Login</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {user && userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '220px',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    zIndex: 1010,
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-card-subtle)' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    {isAdmin && (
                      <span className="badge badge-featured" style={{ marginTop: '4px', fontSize: '0.65rem' }}>
                        Admin Portal Access
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '6px 0' }}>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: 'var(--primary)',
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                      }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} /> My Account
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                      }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package size={16} /> Order History
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.88rem',
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderTop: '1px solid var(--border-light)',
                        marginTop: '4px',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-secondary btn-icon mobile-hamburger"
              style={{ width: '38px', height: '38px' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="form-input"
                placeholder="Search eco products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All Products</Link>
              <Link to="/shop?eco=true" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--primary)' }}>
                🌿 Eco Friendly Picks
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                Wishlist ({wishlist.length})
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--secondary)' }}>
                  👑 Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 820px) {
          .desktop-search { display: block !important; }
          .desktop-links { display: flex !important; }
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 819px) {
          .desktop-search { display: none !important; }
          .desktop-links { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
