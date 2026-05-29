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
  quantity: number;
  coverImage?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
