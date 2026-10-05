import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products as localProducts, categories as localCategories } from '../data/products';
import './Shop.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Silver', 'Brown', 'Grey', 'Gold'];

const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <button className="filter-section-title" onClick={() => setOpen(!open)}>
        {title} {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    minPrice: '',
    maxPrice: ''
  });

  // Sync filters when URL search params change (e.g. navbar category links)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || '',
      size: searchParams.get('size') || '',
      color: searchParams.get('color') || '',
    }));
  }, [searchParams]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/categories')
      .then(res => setCategories(res.data?.length ? res.data : localCategories))
      .catch(() => setCategories(localCategories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params.append(key, value); });

    axios.get(`http://localhost:8080/api/v1/products?${params.toString()}`)
      .then(res => {
        const data = res.data.content || [];
        if (data.length) { setProducts(data); return; }
        throw new Error('empty');
      })
      .catch(() => {
        let filtered = localProducts;
        if (filters.category) filtered = filtered.filter(p => p.category.name === filters.category);
        if (filters.color) filtered = filtered.filter(p => p.color === filters.color);
        if (filters.size) filtered = filtered.filter(p => p.size === filters.size);
        if (filters.minPrice) filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
        if (filters.maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));

  const clearFilters = () => {
    setFilters({ category: '', size: '', color: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="shop-page">
      {/* Hero Banner */}
      <div className="shop-hero">
        <div className="shop-hero-content">
          <h1>{filters.category || 'All Collections'}</h1>
          <p>{sortedProducts.length} products</p>
        </div>
      </div>

      <div className="shop-body container">

        <div className="shop-layout">
          {/* Sidebar */}
          <aside className={`filter-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {activeFilterCount > 0 && (
                  <button className="clear-link" onClick={clearFilters}>Clear all</button>
                )}
                <button className="icon-btn" onClick={() => setShowFilters(false)}><X size={18} /></button>
              </div>
            </div>

            <FilterSection title="Category">
              {categories.map(c => (
                <label key={c.id} className="check-label">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === c.name}
                    onChange={() => setFilter('category', c.name)}
                  />
                  {c.name}
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Size">
              <div className="size-grid">
                {SIZES.map(s => (
                  <button
                    key={s}
                    className={`size-btn ${filters.size === s ? 'size-active' : ''}`}
                    onClick={() => setFilter('size', s)}
                  >{s}</button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Color">
              <div className="color-grid">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className={`color-dot ${filters.color === c ? 'color-active' : ''}`}
                    title={c}
                    style={{ background: c.toLowerCase() === 'silver' ? '#c0c0c0' : c.toLowerCase() === 'gold' ? '#FFD700' : c.toLowerCase() === 'floral' ? 'linear-gradient(135deg,#f9a8d4,#86efac)' : c.toLowerCase() }}
                    onClick={() => setFilter('color', c)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price Range (₹)">
              <div className="price-row">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={e => setFilters(p => ({ ...p, minPrice: e.target.value }))}
                  className="price-input"
                />
                <span className="price-sep">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={e => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
                  className="price-input"
                />
              </div>
            </FilterSection>
          </aside>

          {/* Overlay for mobile */}
          {showFilters && <div className="sidebar-overlay" onClick={() => setShowFilters(false)} />}

          {/* Products */}
          <div className="product-display">
            {loading ? (
              <div className="loading-grid">
                {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="product-grid">
                {sortedProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🛍️</div>
                <h3>No products found</h3>
                <p>Try adjusting or clearing your filters.</p>
                <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
