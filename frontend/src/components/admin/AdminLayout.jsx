import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-screen bg-base-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title={title} subtitle={subtitle} />
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;