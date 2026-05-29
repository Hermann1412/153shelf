import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mediaUrl } from '../lib/config';
import toast from 'react-hot-toast';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRead = () => {
    if (!user) {
      toast.error('Please login to read');
      navigate('/login');
      return;
    }
    navigate(`/read/${product._id}`);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.coverImage ? mediaUrl(product.coverImage) : 'https://placehold.co/200x280?text=No+Cover'}
          alt={product.title}
          className="product-img"
        />
      </Link>
      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-title">{product.title}</h3>
        </Link>
        <p className="product-author">{product.author}</p>
        <p className="product-category">{product.category}</p>
        <div className="product-footer">
          <button className="btn-add" onClick={handleRead}>📖 Read</button>
        </div>
      </div>
    </div>
  );
}
