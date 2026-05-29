import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    toast.success(`"${product.title}" added to cart`);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.coverImage ? `http://localhost:5000${product.coverImage}` : 'https://placehold.co/200x280?text=No+Cover'}
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
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="btn-add"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
