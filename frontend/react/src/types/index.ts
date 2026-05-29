export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  rating: number;
  numReviews: number;
  pages?: number;
  language?: string;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
  coverImage?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
