import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="text-left">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Selamat datang di SweetMerry</h1>
        <p className="text-gray-600 mb-6">Pesan kue dan layanan catering dengan mudah. Pilih tanggal, waktu, dan nikmati servis terbaik.</p>
        <div className="flex gap-3">
          <Link to="/products" className="btn btn-primary">Lihat Produk</Link>
          <Link to="/login" className="btn btn-secondary">Masuk</Link>
        </div>
      </div>
      <div className="card text-left">
        <h2 className="text-xl font-semibold mb-3">Fitur Inti</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Pemesanan dengan tanggal/waktu</li>
          <li>Riwayat dan status pesanan</li>
          <li>Admin kelola produk dan pesanan</li>
        </ul>
      </div>
    </div>
  );
}
