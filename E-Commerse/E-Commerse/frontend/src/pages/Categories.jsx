import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { categories as localCategories } from '../data/products';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/categories')
      .then(res => setCategories(res.data?.length ? res.data : localCategories))
      .catch(() => setCategories(localCategories))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="categories-page container">
      <h1 className="page-title">Shop by Category</h1>
      <p className="page-subtitle">Find exactly what you're looking for in our premium collections.</p>

      {loading ? (
        <div className="loading-state">Loading categories...</div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <Link to={`/shop?category=${category.name}`} key={category.id} className="category-card glass">
              <div className="category-image-container">
                <img
                  src={category.image || `https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80`}
                  alt={category.name}
                  className="category-image"
                />
              </div>
              <div className="category-content">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <span className="explore-link">Explore Collection &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
