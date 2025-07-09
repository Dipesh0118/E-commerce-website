import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const AdminHeader = ({ title, subtitle }) => (
  <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm">
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    <Link to="/" className="btn btn-ghost flex items-center gap-2">
      <Home size={18} /> Back to Home
    </Link>
  </header>
);

export default AdminHeader;
