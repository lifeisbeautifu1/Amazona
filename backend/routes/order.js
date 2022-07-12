import express from 'express';
import {
  createOrder,
  getOrder,
  getMyOrders,
  updatePayment,
  getSummary,
  getOrders,
  updateDelievery,
  deleteOrder,
} from '../controllers/order.js';

import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/', createOrder);

router.get('/', isAdmin, getOrders);

router.get('/summary', isAdmin, getSummary);

router.get('/mine', getMyOrders);

router.get('/:id', getOrder);

router.delete('/:id', isAdmin, deleteOrder);

router.patch('/:id/deliver', isAdmin, updateDelievery);

router.patch('/:id/pay', updatePayment);

export default router;
