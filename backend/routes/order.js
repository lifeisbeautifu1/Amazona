import express from 'express';
import {
  createOrder,
  getOrder,
  getMyOrders,
  updatePayment,
  getSummary,
} from '../controllers/order.js';

import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/', createOrder);

router.get('/summary', isAdmin, getSummary);

router.get('/mine', getMyOrders);

router.get('/:id', getOrder);

router.patch('/:id/pay', updatePayment);

export default router;
