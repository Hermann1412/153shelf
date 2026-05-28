import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x "${product.title}" added to cart`);
  };

  return (
    <div className="container product-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="detail-grid">
        <div className="detail-image">
          <img
            src={product.image || 'https://placehold.co/300x420?text=No+Cover'}
            alt={product.title}
          />
        </div>
        <div className="detail-info">
          <h1>{product.title}</h1>
          <p className="detail-author">by {product.author}</p>
          <span className="detail-category">{product.category}</span>
          <div className="detail-rating">
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span> ({product.numReviews} reviews)</span>
          </div>
          <p className="detail-description">{product.description}</p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className={`detail-stock ${product.stock === 0 ? 'out' : ''}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          {product.stock > 0 && (
            <div className="detail-actions">
              <div className="qty-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <button className="btn-primary" onClick={handleAdd}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
