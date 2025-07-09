import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">No order found. Please place an order first.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-success" />
          </div>
          
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-lg mt-2 text-gray-600">
            Thank you for your purchase.
          </p>
          
          <div className="badge badge-outline mt-4">
            Order ID: {order._id}
          </div>

          <div className="text-sm mt-4">
            <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            <p><strong>Shipping To:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
          </div>

          <div className="card-actions justify-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary w-full md:w-64"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
