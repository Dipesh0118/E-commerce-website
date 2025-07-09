import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { cartItems } = useSelector(state => state.cart);

  const [address, setAddress]       = useState('');
  const [city, setCity]             = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry]       = useState('');

  // prices
  const subtotal      = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxRate       = 0.1; // 10%
  const taxPrice      = Number((subtotal * taxRate).toFixed(2));
  const shippingPrice = 0;
  const totalPrice    = Number((subtotal + taxPrice + shippingPrice).toFixed(2));

  const submitHandler = async e => {
    e.preventDefault();
    const orderItems = cartItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item._id || item.product,   // ← make sure this matches your cart’s ID field
    }));
    const orderData = {
      orderItems,
      shippingAddress: { address, city, postalCode, country },
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      const created = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      // navigate to confirmation, passing order via state
      navigate('/order-confirmation', { state: { order: created } });
    } catch (err) {
      console.error('Order creation failed:', err);
      // you can show a toast or alert here
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <form onSubmit={submitHandler} className="space-y-4">
              {[
                { val: address,    set: setAddress,    ph: 'Address' },
                { val: city,       set: setCity,       ph: 'City' },
                { val: postalCode, set: setPostalCode, ph: 'Postal Code' },
                { val: country,    set: setCountry,    ph: 'Country' },
              ].map(({ val, set, ph }) => (
                <input
                  key={ph}
                  type="text"
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph}
                  className="input input-bordered w-full"
                  required
                />
              ))}
              <button type="submit" className="btn btn-primary w-full mt-6">
                Place Order
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card bg-base-100 shadow-md p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider"></div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
