import React, { useState } from 'react';
import productsData from '../sampleData/products';

export default function AdminDashboard() {
  const [products, setProducts] = useState(productsData);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  const addProduct = () => {
    if (!name || !price || !category) return;
    const newProduct = { id: Date.now(), name, price: Number(price), category };
    setProducts([newProduct, ...products]);
    setName(''); setPrice(''); setCategory('');
    alert('Produk ditambahkan (mock, belum tersimpan permanen)');
  };

  const removeOrder = (idx) => {
    const next = [...orders];
    next.splice(idx, 1);
    localStorage.setItem('orders', JSON.stringify(next));
    window.location.reload();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 text-left">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Kelola Produk</h2>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <input className="form-input" placeholder="Nama" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="form-input" placeholder="Harga" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} />
          <input className="form-input" placeholder="Kategori" value={category} onChange={(e)=>setCategory(e.target.value)} />
        </div>
        <button className="btn btn-primary mb-4" onClick={addProduct}>Tambah Produk</button>
        <ul className="divide-y">
          {products.map(p => (
            <li key={p.id} className="py-2 flex justify-between">
              <span>{p.name} • {p.category} • Rp{p.price.toLocaleString('id-ID')}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Daftar Pemesanan</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">Belum ada pesanan.</p>
        ) : (
          <ul className="divide-y">
            {orders.map((o, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{o.productName} • {o.email}</div>
                  <div className="text-sm text-gray-600">{o.date} • {o.time} • {o.status}</div>
                </div>
                <button className="btn" onClick={()=>removeOrder(idx)}>Hapus</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
