import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, logout }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">SweetMerry</Link>
        <div className="flex items-center gap-4">
          <Link to="/products" className="text-gray-700 hover:text-primary">Produk</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 hover:text-primary">Admin</Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-primary">Dashboard</Link>
              <button onClick={logout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
