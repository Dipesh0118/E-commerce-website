// backend/routes/authRoutes.js
import express from 'express';
import { registerUser,loginUser, createAdmin} from '../controllers/authController.js';
import { protect, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add a simple test endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes working' });
});
router.post('/register', registerUser);


router.post('/login', loginUser);
router.post('/admin/create', createAdmin);
export default router;