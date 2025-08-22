import React from 'react';

export default function Dashboard({ user }) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]').filter(o => o.email === user.email);

  return (
    <div className="text-left">
      <h1 className="text-2xl font-bold mb-4">Halo, {user.name}</h1>
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Riwayat Pesanan</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">Belum ada pesanan. Mulai dari halaman Produk.</p>
        ) : (
          <ul className="divide-y">
            {orders.map((order, idx) => (
              <li key={idx} className="py-3 flex justify-between">
                <div>
                  <div className="font-medium">{order.productName}</div>
                  <div className="text-sm text-gray-600">{order.date} • {order.time}</div>
                </div>
                <span className="text-sm">Status: <span className="font-medium">{order.status}</span></span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
