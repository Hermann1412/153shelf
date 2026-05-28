import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cartItems') || '[]');
    } catch {
      return [];
    }
  });

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existing = items.find((i) => i.product._id === product._id);
    if (existing) {
      save(items.map((i) => i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i));
    } else {
      save([...items, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    save(items.filter((i) => i.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    save(items.map((i) => i.product._id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => save([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
