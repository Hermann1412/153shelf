import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Library from './pages/Library';
import Reader from './pages/Reader';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/read/:id" element={<ProtectedRoute><Reader /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
