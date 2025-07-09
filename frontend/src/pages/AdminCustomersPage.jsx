import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectIsAdmin } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Edit2 } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getCustomersApi, updateCustomerApi } from '../services/customerApi';

const AdminCustomersPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [sortOrder, setSortOrder] = useState('default');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomersApi();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load customers');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      toast.error('Admin access only');
      navigate('/login');
    } else {
      fetchCustomers();
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const openEdit = (customer) => {
    setForm({ name: customer.name, email: customer.email });
    setEditing(customer);
  };
  const closeEdit = () => {
    setEditing(null);
    setForm({ name: '', email: '' });
  };

  const saveEdit = async () => {
    try {
      await updateCustomerApi(editing._id, form);
      toast.success('Customer updated');
      closeEdit();
      fetchCustomers();
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  // Filter out admin users
  let nonAdminCustomers = customers.filter((c) => c.role !== 'admin');

  // Apply sorting
  if (sortOrder === 'asc') {
    nonAdminCustomers.sort((a, b) => (a.totalSpent ?? 0) - (b.totalSpent ?? 0));
  } else if (sortOrder === 'desc') {
    nonAdminCustomers.sort((a, b) => (b.totalSpent ?? 0) - (a.totalSpent ?? 0));
  }

  return (
    <AdminLayout
      title="Customer Management"
      subtitle="View and manage customer information"
    >
      {/* Search + Sort */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search customers..."
          className="input input-bordered max-w-sm w-full"
          onChange={(e) => {
            const term = e.target.value.toLowerCase();
            setCustomers((prev) =>
              prev.filter(
                (u) =>
                  u.name.toLowerCase().includes(term) ||
                  u.email.toLowerCase().includes(term)
              )
            );
          }}
        />
        <select
          className="select select-bordered w-full max-w-xs"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Sort by Total Spent</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Loading…
                </td>
              </tr>
            ) : nonAdminCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              nonAdminCustomers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.totalOrders ?? 0}</td>
                  <td>${(c.totalSpent ?? 0).toFixed(2)}</td>
                  <td className="flex justify-center">
                    <button
                      className="btn btn-ghost btn-square"
                      onClick={() => openEdit(c)}
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-md">
            <button
              onClick={closeEdit}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold">Edit Customer</h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <label className="w-24">Name:</label>
                <input
                  className="input input-bordered flex-1"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="flex items-center">
                <label className="w-24">Email:</label>
                <input
                  className="input input-bordered flex-1"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-action">
              <button onClick={closeEdit} className="btn">
                Cancel
              </button>
              <button onClick={saveEdit} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomersPage;
