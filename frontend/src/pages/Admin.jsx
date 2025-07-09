import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';

const Admin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/admin/create', formData);
      toast.success('Admin created successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Create New Admin</h2>
        <button
          onClick={() => navigate('/admin/orders')}
          className="btn btn-ghost"
        >
          ← Back to Admin Panel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div className="form-control">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input input-bordered"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default Admin;