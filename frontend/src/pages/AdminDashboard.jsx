import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchProducts, deleteProduct } from '../redux/productSlice';
import { selectIsAdmin, selectIsAuthenticated } from '../redux/slices/userSlice';
import { Pencil, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { products, loading, error } = useAppSelector(state => state.product);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      toast.error('You need to be logged in as an admin to access this page');
      navigate('/login');
    } else {
      dispatch(fetchProducts({ page: 1, limit: 1000 }));
    }
  }, [isAuthenticated, isAdmin, navigate, dispatch]);

  useEffect(() => {
    setFilteredProducts(
      searchTerm.trim() === ''
        ? products
        : products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  }, [searchTerm, products]);

  const handleEdit = id => navigate(`/admin/product/${id}/edit`);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteProduct(deleteTarget.id))
      .unwrap()
      .then(() => toast.success(`${deleteTarget.name} deleted successfully`))
      .catch(() => toast.error('Failed to delete product'));
    setDeleteTarget(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/product/create')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Add Product
          </button>
          {/* <button
            onClick={() => navigate('/admin/create')}
            className="btn btn-secondary flex items-center gap-2"
          >
            Create Admin
          </button> */}
          <button
    onClick={() => navigate('/admin/orders')}
    className="btn btn-accent flex items-center gap-2"
  >
    Go to Admin Panel
  </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or category..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="input input-bordered w-full mb-6"
      />

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-error">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.countInStock}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="btn btn-sm btn-outline"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: product._id, name: product.name })}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DaisyUI Modal for Delete Confirmation */}
      <div className={`modal ${deleteTarget ? 'modal-open' : ''}`}>  
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          </p>
          <div className="modal-action">
            <button
              onClick={handleConfirmDelete}
              className="btn btn-error"
            >
              Yes
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              className="btn"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
