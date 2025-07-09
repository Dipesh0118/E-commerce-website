import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api
      .get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!order) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const { shippingAddress, orderItems, taxPrice, shippingPrice, totalPrice, isDelivered, createdAt } = order;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-start mb-4">
        <Link to="/orders" className="btn btn-outline btn-sm">
          &larr; Back to My Orders
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>
      <div className="space-y-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Shipping Address</h2>
            <p className="mt-2">
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <p className="mt-2">
              Status: <span className={`badge ${isDelivered ? 'badge-success' : 'badge-error'}`}>{isDelivered ? 'Delivered' : 'Not Delivered'}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Ordered on: {new Date(createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Items</h2>
            <ul className="divide-y divide-gray-200 mt-2">
              {orderItems.map(item => (
                <li key={item._id || item.product} className="py-3 flex justify-between">
                  <span>{item.name} (x{item.qty})</span>
                  <span className="font-semibold">${(item.qty * item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Summary</h2>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
