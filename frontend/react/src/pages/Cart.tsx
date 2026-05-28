import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <h2>Your Cart</h2>
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-primary">Browse Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h2>Your Cart</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="cart-item">
              <img
                src={product.image || 'https://placehold.co/80x110?text=Book'}
                alt={product.title}
                className="cart-item-img"
              />
              <div className="cart-item-info">
                <Link to={`/products/${product._id}`}>
                  <h4>{product.title}</h4>
                </Link>
                <p>{product.author}</p>
                <p className="cart-item-price">${product.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQuantity(product._id, quantity - 1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                </div>
                <p className="cart-item-subtotal">${(product.price * quantity).toFixed(2)}</p>
                <button
                  className="btn-remove"
                  onClick={() => { removeFromCart(product._id); toast.success('Removed from cart'); }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <strong>Total</strong>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <button className="btn-primary full-width" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <button className="btn-secondary full-width" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
