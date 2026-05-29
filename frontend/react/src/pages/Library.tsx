import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { mediaUrl } from '../lib/config';
import type { Product } from '../types';

export default function Library() {
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?limit=100')
      .then((res) => setBooks(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading your library...</div>;

  return (
    <div className="container orders-page">
      <h2>📚 All Books — Read Free</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Every book on 153Shelf is free to read. Login and start reading instantly.
      </p>
      {books.length === 0 ? (
        <div className="empty-state">No books available yet.</div>
      ) : (
        <div className="library-grid">
          {books.map((book) => (
            <div key={book._id} className="library-card">
              <img
                src={book.coverImage ? mediaUrl(book.coverImage) : 'https://placehold.co/180x240?text=No+Cover'}
                alt={book.title}
                className="library-cover"
              />
              <div className="library-info">
                <h4>{book.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{book.author}</p>
                {book.pages && <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{book.pages} pages</p>}
                <button className="btn-read" onClick={() => navigate(`/read/${book._id}`)}>
                  📖 Read Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
