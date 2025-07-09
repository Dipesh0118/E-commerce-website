import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { admin } from '../middlewares/adminMiddleware.js';
import {
  addOrderItems,
  getOrderById,
  toggleOrderDelivered,
  getMyOrders,
  getOrders,
  updateOrderItemsAdmin,
  getOrderStats,
  removeOrderItems,
  deleteOrder,
} from '../controllers/orderController.js';

const router = express.Router();
router.route('/stats').get(protect, admin, getOrderStats);

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

// backend/routes/orderRoutes.js
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder); // Add this line

router.route('/:id/deliver').put(protect, admin, toggleOrderDelivered);
router.route('/:id/items')
  .put(protect, admin, updateOrderItemsAdmin);
  router
  .route('/:id/items/remove')
  .put(protect, admin, removeOrderItems);

export default router;
