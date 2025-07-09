import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from '../redux/slices/cartSlice';
import { ShoppingCart, Plus, Minus, Trash } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.user.userInfo);
  const isAdmin = userInfo?.role === 'admin';

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleIncreaseQuantity = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(decrementQuantity(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!userInfo) {
      toast.error('Please log in to checkout');
      return navigate('/login');
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product}>
                  <td className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <Link
                        to={`/product/${item.product}`}
                        className="font-semibold hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleDecreaseQuantity(item.product)}
                        disabled={item.qty <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleIncreaseQuantity(item.product)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td>${(item.price * item.qty).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error btn-outline"
                      onClick={() => handleRemoveItem(item.product)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button className="btn btn-outline btn-error" onClick={handleClearCart}>
              Clear Cart
            </button>
            <Link to="/" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card bg-base-100 shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${(totalAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>${(totalAmount * 1.1).toFixed(2)}</span>
            </div>
          </div>

          <button
  className="btn btn-primary btn-block mt-6"
  onClick={handleCheckout}
  disabled={isAdmin}
  title={isAdmin ? 'Admins cannot place orders' : ''}
>
  {userInfo ? 'Proceed to Checkout' : 'Login to Checkout'}
</button>

        </div>
      </div>
    </div>
  );
};

export default Cart;
