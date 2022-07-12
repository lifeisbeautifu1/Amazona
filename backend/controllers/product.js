import Product from '../models/product.js';
import expressAsyncHandler from 'express-async-handler';

const PAGE_SIZE = 3;

export const getProducts = expressAsyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

export const postReview = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    if (product.reviews.find((review) => review.name === req.user.name)) {
      return res.status(400).json({ message: 'You already submitted review' });
    } else {
      const review = {
        name: req.user.name,
        rating: req.body.rating,
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((total, review) => total + review.rating, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).json({ product: updatedProduct });
      // res.status(201).json({
      //   message: 'Review Created',
      //   review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      //   numReviews: product.numReviews,
      //   rating: product.rating,
      // });
    }
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
});

export const createProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.create({
    name: 'sample name ' + Date.now(),
    slug: 'sample-name-' + Date.now(),
    image: '/images/p1.jpeg',
    images: [],
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    rating: 0,
    reviews: [],
    numReviews: 0,
    description: 'sample description',
  });
  res.status(201).json({
    message: 'Product Created',
    product,
  });
});

export const deleteProduct = expressAsyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Product Deleted' });
});

export const getProductsAdmin = expressAsyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || PAGE_SIZE;

  const products = await Product.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments();

  res.status(200).json({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

export const searchProducts = expressAsyncHandler(async (req, res) => {
  const pageSize = req.query.pageSize || PAGE_SIZE;
  const page = req.query.page || 1;
  const category = req.query.category || '';
  const price = req.query.price || '';
  const rating = req.query.rating || '';
  const order = req.query.order || '';
  const searchQuery = req.query.query || '';

  const queryFilter =
    searchQuery && searchQuery.trim() !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  const categoryFilter =
    category && category.trim() !== 'all'
      ? {
          category,
        }
      : {};

  const ratingFilter =
    rating && rating.trim() !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const priceFilter =
    price && price.trim() !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const sortOrder =
    order === 'featured'
      ? { featured: -1 }
      : order === 'lowest'
      ? { price: 1 }
      : order === 'highest'
      ? { price: -1 }
      : order === 'toprated'
      ? { rating: -1 }
      : order === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

export const getCategories = expressAsyncHandler(async (req, res) => {
  const categories = await Product.find().distinct('category');
  res.status(200).json(categories);
});

export const getProductBySlug = expressAsyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
});

export const getProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
});

export const updateProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ message: 'Product updated' });
});
