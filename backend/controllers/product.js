import Product from '../models/product.js';

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
};
