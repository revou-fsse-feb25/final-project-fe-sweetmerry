import React, { useState } from 'react';

export default function Login({ login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }
    // Mock login: admin if email includes 'admin'
    const role = email.includes('admin') ? 'admin' : 'user';
    login({ email, role, name: email.split('@')[0] });
  };

  return (
    <div className="max-w-md mx-auto card text-left">
      <h1 className="text-2xl font-bold mb-4">Masuk</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="form-input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="form-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  );
}
