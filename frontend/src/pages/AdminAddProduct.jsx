import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/admin/ProductForm';

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New Product</h2>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-ghost"
        >
          ← Back to Dashboard
        </button>
      </div>
      <ProductForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AdminAddProduct;