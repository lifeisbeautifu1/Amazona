import express from 'express';
import Product from '../models/product.js';
import data from '../data.js';

const router = express.Router();

router.get('/', async (req, res) => {
  await Product.deleteMany({});
  const products = await Product.insertMany(data.products);
  res.status(200).json(products);
});

export default router;
