// backend/controllers/orderController.js

import Order from '../models/OrderModel.js';
import Product from '../models/productModel.js'; // ⬅️ Import Product model
import { startOfMonth, endOfMonth } from "date-fns";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    // console.log('👉 addOrderItems req.user =', req.user);
    // console.log('👉 addOrderItems req.body =', JSON.stringify(req.body, null, 2));

    const { orderItems, shippingAddress, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Step 1: Validate stock availability
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
    }

    // Step 2: Create the order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Step 3: Decrement stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.countInStock -= item.qty;
      await product.save();
    }

    return res.status(201).json(createdOrder);

  } catch (error) {
    console.error(' Error in addOrderItems:', error);
    return res.status(500).json({ message: error.message });
  }
};
export const getOrderStats = async (req, res) => {
  try {
    const { month } = req.query;

    let match = {};

    if (month) {
      const start = new Date(`${month}-01T00:00:00Z`);
      const end = endOfMonth(start);
      match.createdAt = { $gte: start, $lte: end };
    }

    // 1) Total Orders, Revenue, Delivered/Pending for the selected month
    const orders = await Order.find(match);
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.isDelivered).length;
    const pendingOrders = totalOrders - deliveredOrders;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    // 2) Monthly sales aggregation (for charts)
    const monthlySales = await Order.aggregate([
      { $match: match },
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: "$totalPrice"
        }
      },
      {
        $group: {
          _id: "$month",
          sales: { $sum: "$total" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 3) Top products aggregation
    const topProducts = await Order.aggregate([
      { $match: match },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          qty: { $sum: "$orderItems.qty" }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: 5 }
    ]);

    return res.json({
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalRevenue,
      monthlySales,
      topProducts
    });

  } catch (error) {
    console.error("🔥 Error in getOrderStats:", error);
    return res.status(500).json({ message: error.message });
  }
};
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  // only owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized to view this order' });
  }

  res.json(order);
};

/*
 * @desc    Remove one or more products from an order's items array
 * @route   PUT /api/orders/:id/items/remove
 * @access  Private/Admin
 */
export const removeOrderItems = async (req, res) => {
  const orderId    = req.params.id;
  const toDelete   = req.body.productIds;      // expect: [ "<productId1>", "<productId2>", … ]

  if (!Array.isArray(toDelete) || toDelete.length === 0) {
    return res.status(400).json({ message: 'No product IDs provided' });
  }

  try {
    // Note: pulling by matching the sub‐doc field `product`
    // MongoDB doesn’t support $pullAll on sub-docs directly,
    // so we use $pull + $in to remove any items whose `product` is in our list:
    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        $pull: {
          orderItems: { product: { $in: toDelete } }
        }
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });
    return res.json(updated);
  } catch (err) {
    console.error('🔥 Error in removeOrderItems:', err);
    return res.status(500).json({ message: err.message });
  }
};
// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const toggleOrderDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.isDelivered = !order.isDelivered; // Toggle
  const updated = await order.save();
  res.json(updated);
};
// @desc    Get logged-in user’s orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};
// @desc    Update items & stock for an order
// @route   PUT /api/orders/:id/items
// @access  Private/Admin
// Update orderItemsAdmin function (or the function that processes order updates)
export const updateOrderItemsAdmin = async (req, res) => {
  try {
      const orderId = req.params.id;  // The order id
      const updatedItems = req.body.orderItems;  // The new items sent in the request

      // Find the order document
      const order = await Order.findById(orderId);

      // Step 1: Restore stock of previous order items
      for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          product.countInStock += item.qty;  // Restore previous quantity
          await product.save();
      }

      // Step 2: Deduct stock for the updated quantities
      let newTotalPrice = 0;
      let newTaxPrice = 0;
      
      for (const newItem of updatedItems) {
          const product = await Product.findById(newItem.product);
          product.countInStock -= newItem.qty;  // Deduct the new quantity
          await product.save();

          // Recalculate total price and tax price
          newTotalPrice += newItem.qty * newItem.price;
      }

      // Calculate tax price (example: 10% tax rate)
      newTaxPrice = newTotalPrice * 0.1;  // 10% tax
      const newShippingPrice = 0;  // Update this based on your business logic

      // Step 3: Update the order with new prices and items
      order.orderItems = updatedItems;
      order.totalPrice = newTotalPrice + newShippingPrice + newTaxPrice;
      order.taxPrice = newTaxPrice;
      order.shippingPrice = newShippingPrice;

      await order.save();

      res.status(200).json(order);  // Respond with the updated order
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating order items' });
  }
};
// backend/controllers/orderController.js
// backend/controllers/orderController.js
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.countInStock += item.qty;
      await product.save();
    }

    // Use deleteOne() instead of remove()
    await Order.deleteOne({ _id: order._id });
    
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('🔥 Error deleting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};