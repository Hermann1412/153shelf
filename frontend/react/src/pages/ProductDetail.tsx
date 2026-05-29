import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { mediaUrl } from '../lib/config';
import toast from 'react-hot-toast';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null;

  const handleRead = () => {
    if (!user) {
      toast.error('Please login to read');
      navigate('/login');
      return;
    }
    navigate(`/read/${product._id}`);
  };

  return (
    <div className="container product-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="detail-grid">
        <div className="detail-image">
          <img
            src={product.coverImage ? mediaUrl(product.coverImage) : 'https://placehold.co/300x420?text=No+Cover'}
            alt={product.title}
          />
        </div>
        <div className="detail-info">
          <h1>{product.title}</h1>
          <p className="detail-author">by {product.author}</p>
          <span className="product-category">{product.category}</span>
          <div className="detail-rating">
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span> ({product.numReviews} reviews)</span>
          </div>
          {product.pages && <p className="detail-meta">📄 {product.pages} pages &nbsp;·&nbsp; 🌐 {product.language}</p>}
          <p className="detail-description">{product.description}</p>
          <button className="btn-primary btn-read-large" onClick={handleRead}>
            📖 Read Now
          </button>
          {!user && <p className="detail-login-hint">You need to <span onClick={() => navigate('/login')} className="link">login</span> to read</p>}
        </div>
      </div>
    </div>
  );
}
