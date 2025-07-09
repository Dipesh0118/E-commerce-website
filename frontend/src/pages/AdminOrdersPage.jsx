import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Repeat, PackageCheck, PackageX, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import {
  getOrdersApi,
  markOrderDeliveredApi,
  updateOrderItemApi,
  removeOrderItemsApi,
  deleteOrderApi,
  getOrderStatsApi,
} from '../services/orderApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EditOrderItemsModal from '../components/EditOrderItemsModal';

const Spinner = () => <div className="text-center p-4">Loading...</div>;
const Message = ({ children }) => <div className="text-error p-4">{children}</div>;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [editOrder, setEditOrder] = useState(null);

  const [stats, setStats] = useState({ monthlySales: [], topProducts: [] });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [statsMonth, setStatsMonth] = useState(new Date());

  const [startDate, endDate] = dateRange;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrdersApi();
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (month) => {
    try {
      setStatsLoading(true);
      const statsData = await getOrderStatsApi(month);
      setStats(statsData);
      setStatsError('');
    } catch (err) {
      setStatsError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const toggleDelivered = async (id) => {
    try {
      await markOrderDeliveredApi(id);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order');
    }
  };

  const openItemEditor = (order) => {
    if (!order.isDelivered) setEditOrder(order);
  };
  const closeModal = () => setEditOrder(null);

  const handleItemsSave = async (orderId, updatedItems) => {
    try {
      await updateOrderItemApi(orderId, updatedItems);
      fetchOrders();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleItemsRemove = async (orderId, productId) => {
    try {
      const order = orders.find(o => o._id === orderId);
      if (!order) return;

      if (order.orderItems.length === 1) {
        await deleteOrderApi(orderId);
      } else {
        await removeOrderItemsApi(orderId, [productId]);
      }
      fetchOrders();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Remove failed');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrderApi(orderId);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedTab === 'stats') {
      fetchStats(statsMonth);
    }
  }, [selectedTab, statsMonth]);

  const filteredOrders = orders.filter(o => {
    const cust = o.user?.name?.toLowerCase() || '';
    const mail = o.user?.email?.toLowerCase() || '';
    const id = o._id.toLowerCase();
    const items = o.orderItems.map(i => i.name.toLowerCase()).join(' ');
    const search = `${cust} ${mail} ${id} ${items}`;
    const matchSearch = search.includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter
      ? statusFilter === 'delivered'
        ? o.isDelivered
        : !o.isDelivered
      : true;
    const matchDate = startDate && endDate
      ? new Date(o.createdAt) >= startDate && new Date(o.createdAt) <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999)
      : true;
    return matchSearch && matchStatus && matchDate;
  });

  return (
    <AdminLayout title="Orders Management" subtitle="Manage and update order status">
      <div className="flex gap-4 mb-4">
        <button className={`tab ${selectedTab === 'list' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('list')}>Orders List</button>
        <button className={`tab ${selectedTab === 'stats' ? 'tab-active' : ''}`} onClick={() => setSelectedTab('stats')}>Statistics</button>
      </div>

      {selectedTab === 'list' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input input-bordered flex-1 min-w-[200px]"
            />
            <button className="btn btn-square" onClick={fetchOrders}><Repeat size={20} /></button>
            <select className="select select-bordered" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">Filter Status</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
            </select>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={setDateRange}
              isClearable
              className="input input-bordered"
              placeholderText="Date Range"
            />
            <button className="btn btn-ghost" onClick={() => { setSearchTerm(''); setStatusFilter(''); setDateRange([null, null]); }}>Clear</button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7}><Spinner/></td></tr>
                ) : error ? (
                  <tr><td colSpan={7}><Message>{error}</Message></td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4">No orders found</td></tr>
                ) : (
                  filteredOrders.map(o => (
                    <tr key={o._id}>
                      <td className="font-mono">#{o._id.slice(-7)}</td>
                      <td>
                        <div className="font-semibold">{o.user?.name}</div>
                        <div className="text-sm text-gray-500">{o.user?.email}</div>
                      </td>
                      <td>{format(new Date(o.createdAt), 'MMM dd, yyyy')}</td>
                      <td>${o.totalPrice.toFixed(2)}</td>
                      <td>{o.orderItems.length} items</td>
                      <td><span className={`badge ${o.isDelivered ? 'badge-success' : 'badge-warning'}`}>{o.isDelivered ? 'Delivered' : 'Pending'}</span></td>
                      <td className="flex justify-center gap-2">
                        <button className="btn btn-square btn-ghost" onClick={() => openItemEditor(o)} disabled={o.isDelivered}><Edit size={18}/></button>
                        <button className={`btn btn-square ${o.isDelivered ? 'btn-error' : 'btn-primary'}`} onClick={() => toggleDelivered(o._id)}>
                          {o.isDelivered ? <PackageX size={18}/> : <PackageCheck size={18}/>}
                        </button>
                        <button className="btn btn-square btn-error" onClick={() => handleDeleteOrder(o._id)} disabled={o.isDelivered}><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <StatisticsView
          stats={stats}
          loading={statsLoading}
          error={statsError}
          statsMonth={statsMonth}
          setStatsMonth={setStatsMonth}
          fetchStats={fetchStats}
        />
      )}

      {editOrder && (
        <EditOrderItemsModal
          order={editOrder}
          onClose={closeModal}
          onSave={handleItemsSave}
          onRemove={pid => handleItemsRemove(editOrder._id, pid)}
        />
      )}
    </AdminLayout>
  );
};

function StatisticsView({ stats, loading, error, statsMonth, setStatsMonth, fetchStats }) {
  const handleMonthChange = (date) => {
    setStatsMonth(date);
    fetchStats(date);
  };

  if (loading) return <Spinner />;
  if (error) return <Message>{error}</Message>;

  const { totalOrders, deliveredOrders, pendingOrders, totalRevenue, topProducts } = stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <label className="mr-2 font-medium">Select Month:</label>
        <DatePicker
          selected={statsMonth}
          onChange={handleMonthChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="input input-bordered"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-gray-500 text-sm">Delivered</p>
          <p className="text-2xl font-bold">{deliveredOrders || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold">{pendingOrders || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold">${(totalRevenue || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Top Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" angle={-45} textAnchor="end" height={60} interval={0} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="qty" name="Quantity Sold" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
