import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const cardEl = elements.getElement(CardElement);
    if (!cardEl) return;

    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-intent', { amount: totalPrice });

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardEl },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        return;
      }

      const orderItems = items.map((i) => ({
        product: i.product._id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        coverImage: i.product.coverImage,
      }));

      await api.post('/orders', {
        items: orderItems,
        totalPrice,
        stripePaymentIntentId: paymentIntent?.id,
      });

      clearCart();
      toast.success('Purchase complete! Books added to your library.');
      navigate('/orders');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Checkout failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="checkout-section">
        <h3>Payment Details</h3>
        <p className="checkout-note">Digital delivery — books are instantly added to your library after payment.</p>
        <div className="card-element-wrapper">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#e0e0e0', '::placeholder': { color: '#a0a0b0' } } } }} />
        </div>
      </div>
      <div className="checkout-summary">
        <p>Total: <strong>${totalPrice.toFixed(2)}</strong></p>
        <button type="submit" className="btn-primary full-width" disabled={!stripe || loading}>
          {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}

export default function Checkout() {
  const { items } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <div className="checkout-left">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
        <div className="checkout-right">
          <h3>Your Order</h3>
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="checkout-item">
              <div className="checkout-item-info">
                <img
                  src={product.coverImage ? `http://localhost:5000${product.coverImage}` : 'https://placehold.co/50x70?text=Book'}
                  alt={product.title}
                  className="checkout-item-img"
                />
                <div>
                  <p>{product.title}</p>
                  <p className="checkout-item-author">{product.author}</p>
                </div>
              </div>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-total-row">
            <strong>Total</strong>
            <strong>${items.reduce((s, i) => s + i.product.price * i.quantity, 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
