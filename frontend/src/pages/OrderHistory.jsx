/* src/pages/OrderHistory.jsx */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { myOrders } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div>
      <h1>My Orders</h1>
      {myOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td>{o.isPaid ? new Date(o.paidAt).toLocaleDateString() : 'No'}</td>
                <td>
                  <Link to={`/order/${o._id}`} className="text-blue-500">Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
