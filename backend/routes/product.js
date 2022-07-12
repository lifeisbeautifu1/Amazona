import express from 'express';

import {
  getProducts,
  searchProducts,
  getCategories,
  getProduct,
  updateProduct,
  getProductBySlug,
  getProductsAdmin,
  createProduct,
  deleteProduct,
  postReview,
} from '../controllers/product.js';

import isAdmin from '../middleware/isAdmin.js';
import isAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);

router.post('/:id/reviews', isAuth, postReview);

router.post('/', isAuth, isAdmin, createProduct);

router.delete('/:id', isAuth, isAdmin, deleteProduct);

router.get('/admin', isAuth, isAdmin, getProductsAdmin);

router.get('/search', searchProducts);

router.get('/categories', getCategories);

router.get('/slug/:slug', getProductBySlug);

router.get('/:id', getProduct);

router.patch('/:id', isAuth, isAdmin, updateProduct);

export default router;
