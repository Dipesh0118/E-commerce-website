/* src/pages/MyOrders.jsx */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/orders/myorders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading your orders…</div>;
  if (!orders.length) return <div className="text-center mt-10 text-lg">You have no orders yet.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(o => (
          <Link
            to={`/orders/${o._id}`}
            key={o._id}
            className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
          >
            <div className="card-body">
              <h2 className="card-title text-lg">Order #{o._id}</h2>
              <p className="text-sm text-gray-500">
                Placed on {new Date(o.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold text-lg">${o.totalPrice.toFixed(2)}</span>
                <span className={`badge ${o.isDelivered ? 'badge-success' : 'badge-warning'}`}>
                  {o.isDelivered ? 'Delivered' : 'Not Delivered'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;