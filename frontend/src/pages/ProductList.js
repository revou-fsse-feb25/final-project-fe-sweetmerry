import React, { useState, useEffect } from 'react';
import products from '../sampleData/products';

export default function ProductList({ user }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(products);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(products.filter(p => p.name.toLowerCase().includes(q)));
  }, [query]);

  const handleBook = (product) => {
    if (!user) {
      alert('Silakan login dulu');
      return;
    }
    if (!date || !time) {
      alert('Isi tanggal dan waktu');
      return;
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      email: user.email,
      productId: product.id,
      productName: product.name,
      date,
      time,
      status: 'dikonsfirmasi'
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    setDate('');
    setTime('');
    alert('Pemesanan berhasil!');
  };

  return (
    <div className="text-left">
      <h1 className="text-2xl font-bold mb-4">Produk</h1>
      <div className="mb-4 flex gap-3">
        <input className="form-input" placeholder="Cari produk..." value={query} onChange={(e)=>setQuery(e.target.value)} />
        <input className="form-input" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        <input className="form-input" type="time" value={time} onChange={(e)=>setTime(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="card">
            <div className="font-semibold mb-1">{p.name}</div>
            <div className="text-sm text-gray-600 mb-3">{p.category} • Rp{p.price.toLocaleString('id-ID')}</div>
            <button className="btn btn-primary w-full" onClick={() => handleBook(p)}>Pesan</button>
          </div>
        ))}
      </div>
    </div>
  );
}
