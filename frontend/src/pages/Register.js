import React, { useState } from 'react';

export default function Register({ login }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Semua field wajib diisi');
      return;
    }
    // Mock register: auto login as user
    login({ email, role: 'user', name });
  };

  return (
    <div className="max-w-md mx-auto card text-left">
      <h1 className="text-2xl font-bold mb-4">Daftar</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nama</label>
          <input className="form-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nama Anda" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="form-input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="form-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary w-full">Buat Akun</button>
      </form>
    </div>
  );
}
