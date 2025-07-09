// File: frontend/src/pages/AdminEditProduct.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchProductById } from '../redux/productSlice';
import ProductForm from '../components/admin/ProductForm';
import { toast } from 'sonner';

const AdminEditProduct = () => {
  // FIXED: match the Router path `/admin/product/:productId/edit`
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct, status, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/admin');
    }
  }, [error, navigate]);

  const handleSuccess = () => {
    toast.success('Product updated successfully!');
    navigate('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Edit Product: {currentProduct?.name}
        </h2>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-ghost"
        >
          ← Back to Dashboard
        </button>
      </div>
      {currentProduct && (
        <ProductForm
          onSuccess={handleSuccess}
          isEdit
        />
      )}
    </div>
  );
};

export default AdminEditProduct;