import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import type { Product } from '../types';

const CATEGORIES = ['All', 'Software Engineering', 'Artificial Intelligence', 'Machine Learning', 'Microservices', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Data Science', 'System Design', 'Web Development', 'Algorithms'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { page, limit: 12 };
        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        const res = await api.get('/products', { params });
        setProducts(res.data.products);
        setPages(res.data.pages);
        setTotal(res.data.total);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to 153Shelf</h1>
          <p>Where knowledge is abundant and the shelf never runs out.</p>
        </div>
      </section>

      <div className="container">
        <div className="filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="search-input"
            />
            <button type="submit" className="btn-search">Search</button>
          </form>
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${(category === cat || (cat === 'All' && !category)) ? 'active' : ''}`}
                onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading books...</div>
        ) : (
          <>
            <p className="result-count">{total} book{total !== 1 ? 's' : ''} found</p>
            {products.length === 0 ? (
              <div className="empty-state">No books found. Try a different search.</div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
