// models/Order.js
import mongoose from 'mongoose';

// Schema for individual items in an order
const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { _id: true } // <-- allow _id for each order item for easier array updates
);

// Schema for shipping address
const shippingAddressSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false } // shippingAddress doesn't need its own _id
);

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema], // array of order items
    shippingAddress: shippingAddressSchema, // embedded shipping address
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
    isDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
