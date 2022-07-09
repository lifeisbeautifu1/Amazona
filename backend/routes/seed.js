import express from 'express';
import Product from '../models/product.js';
import User from '../models/user.js';
import data from '../data.js';

const router = express.Router();

router.get('/', async (req, res) => {
  await Product.deleteMany({});
  const products = await Product.insertMany(data.products);
  await User.deleteMany({});
  const users = await User.insertMany(data.users);
  res.status(200).json({ products, users });
});

export default router;
