import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { admin } from '../middlewares/adminMiddleware.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected user routes
router.get('/profile', protect, getUserProfile);

// Admin-only routes
router
  .route('/')
  .get(protect, admin, getUsers);

router
  .route('/:id')
  .put(protect, admin, updateUser);

export default router;
