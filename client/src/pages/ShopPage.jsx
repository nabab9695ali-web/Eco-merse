import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  Star,
  Leaf,
  ChevronLeft,
  ChevronRight,
  PackageX,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { apiRequest } from '../utils/api';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters State
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const ecoParam = searchParams.get('eco') === 'true';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = Number(searchParams.get('page')) || 1;
  const minPriceParam = Number(searchParams.get('minPrice')) || 0;
  const maxPriceParam = Number(searchParams.get('maxPrice')) || 10000;
  const inStockParam = searchParams.get('inStock') === 'true';

  const [priceRange, setPriceRange] = useState(maxPriceParam);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest('/categories');
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products based on URL query
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (searchParam) query.set('keyword', searchParam);
        if (categoryParam && categoryParam !== 'all') query.set('category', categoryParam);
        if (ecoParam) query.set('isEcoChoice', 'true');
        if (inStockParam) query.set('inStock', 'true');
        if (maxPriceParam < 10000) query.set('maxPrice', maxPriceParam);
        if (sortParam) query.set('sort', sortParam);
        query.set('page', pageParam);
        query.set('pageSize', 12);

        const res = await apiRequest(`/products?${query.toString()}`);
        if (res.success) {
          setProducts(res.products);
          setTotalPages(res.pages);
          setTotalProducts(res.totalProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryParam, searchParam, ecoParam, inStockParam, maxPriceParam, sortParam, pageParam]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'all' || val === false) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    // Reset page to 1 on filter changes
    if (!newParams.page) params.set('page', '1');
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setPriceRange(10000);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Top Header & Search Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Store</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing {totalProducts} sustainable & modern products
              {searchParam && <span> for "<strong>{searchParam}</strong>"</span>}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={sortParam}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="form-select"
                style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.85rem' }}
              >
                <option value="newest">Latest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-secondary btn-sm mobile-filter-btn"
              style={{ display: 'flex', gap: '6px' }}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }} className="shop-layout">
        
        {/* Sidebar Filters */}
        <aside
          className={`glass-card shop-sidebar ${mobileFilterOpen ? 'open' : ''}`}
          style={{
            padding: '1.5rem',
            position: 'sticky',
            top: '90px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="var(--primary)" /> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => updateFilters({ category: 'all' })}
                style={{
                  textAlign: 'left',
                  background: categoryParam === 'all' ? 'var(--primary-light)' : 'transparent',
                  color: categoryParam === 'all' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: categoryParam === 'all' ? 700 : 500,
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilters({ category: cat.name })}
                  style={{
                    textAlign: 'left',
                    background: categoryParam.toLowerCase() === cat.name.toLowerCase() ? 'var(--primary-light)' : 'transparent',
                    color: categoryParam.toLowerCase() === cat.name.toLowerCase() ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: categoryParam.toLowerCase() === cat.name.toLowerCase() ? 700 : 500,
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{cat.name}</span>
                  {cat.itemCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.itemCount}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Max Price</h4>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              onMouseUp={() => updateFilters({ maxPrice: priceRange })}
              onTouchEnd={() => updateFilters({ maxPrice: priceRange })}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              <span>₹500</span>
              <span>₹10,000+</span>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={ecoParam}
                onChange={(e) => updateFilters({ eco: e.target.checked })}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Leaf size={14} color="var(--primary)" /> 100% Eco-Friendly Only
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) => updateFilters({ inStock: e.target.checked })}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid Section */}
        <main>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card" style={{ height: '360px', opacity: 0.5, animation: 'pulseGlow 1.5s infinite' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <PackageX size={48} color="var(--text-muted)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No matching products found</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.9rem' }}>
                Try adjusting your search criteria, category filters, or price range.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => updateFilters({ page: Math.max(1, pageParam - 1) })}
                    disabled={pageParam === 1}
                    className="btn btn-secondary btn-icon"
                    style={{ width: '38px', height: '38px', opacity: pageParam === 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateFilters({ page: pageNum })}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${pageParam === pageNum ? 'var(--primary)' : 'var(--border-color)'}`,
                          background: pageParam === pageNum ? 'var(--primary)' : 'var(--bg-card)',
                          color: pageParam === pageNum ? '#ffffff' : 'var(--text-main)',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => updateFilters({ page: Math.min(totalPages, pageParam + 1) })}
                    disabled={pageParam === totalPages}
                    className="btn btn-secondary btn-icon"
                    style={{ width: '38px', height: '38px', opacity: pageParam === totalPages ? 0.5 : 1 }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <style>{`
        @media (max-width: 860px) {
          .shop-layout { grid-template-columns: 1fr !important; }
          .shop-sidebar {
            display: none !important;
          }
          .shop-sidebar.open {
            display: flex !important;
            position: static !important;
          }
          .mobile-filter-btn { display: flex !important; }
        }
        @media (min-width: 861px) {
          .mobile-filter-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
