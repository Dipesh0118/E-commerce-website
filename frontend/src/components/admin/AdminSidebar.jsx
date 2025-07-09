import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, User, ShoppingCart, Settings, Database } from 'lucide-react';

const links = [
  { to: '/admin/orders', label: 'Orders', icon: <Box size={20} /> },
  { to: '/admin/customers', label: 'Customers', icon: <User size={20} /> },
  { to: '/admin', label: 'Products', icon: <Database size={20} /> },
  { to: '/admin/create', label: 'Create New Admin', icon: <Settings size={20} /> },
];

const AdminSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="text-2xl font-bold p-6">Admin Panel</div>
      <nav className="flex flex-col space-y-2 p-4">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors ${
              pathname.startsWith(to) ? 'bg-gray-100 font-semibold' : ''
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
