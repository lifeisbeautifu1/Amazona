import express from 'express';

import {
  getProducts,
  searchProducts,
  getCategories,
  getProduct,
  getProductBySlug,
  getProductsAdmin,
} from '../controllers/product.js';

import isAdmin from '../middleware/isAdmin.js';
import isAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/admin', isAuth, isAdmin, getProductsAdmin);

router.get('/search', searchProducts);

router.get('/categories', getCategories);

router.get('/slug/:slug', getProductBySlug);

router.get('/:id', getProduct);

export default router;
