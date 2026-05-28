import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import type { ShippingAddress } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

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
        image: i.product.image,
      }));

      await api.post('/orders', {
        items: orderItems,
        totalPrice,
        shippingAddress: address,
        stripePaymentIntentId: paymentIntent?.id,
      });

      clearCart();
      toast.success('Order placed successfully!');
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
        <h3>Shipping Address</h3>
        {(['fullName', 'address', 'city', 'postalCode', 'country'] as (keyof ShippingAddress)[]).map((field) => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</label>
            <input
              type="text"
              value={address[field]}
              onChange={handleChange(field)}
              required
            />
          </div>
        ))}
      </div>

      <div className="checkout-section">
        <h3>Payment</h3>
        <div className="card-element-wrapper">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#1a1a2e' } } }} />
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
          <h3>Order Items</h3>
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="checkout-item">
              <span>{product.title} x{quantity}</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
