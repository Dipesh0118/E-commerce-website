// backend/routes/productRoutes.js
import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getCategories
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();
router.get('/categories', getCategories);

// Public listing; authenticated users can also create
router
  .route('/')
  .get(getAllProducts)
  .post(
    protect,
    upload.single('image'),
    createProduct
  );

// Public detail; authenticated users can update or delete
router
  .route('/:id')
  .get(getProductById)
  .put(
    protect,
    upload.single('image'),
    updateProduct
  )
  .delete(
    protect,
    deleteProduct
  );

export default router;
