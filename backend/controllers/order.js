import expressAsyncHandler from 'express-async-handler';
import Order from '../models/order.js';
import User from '../models/user.js';
import Product from '../models/product.js';

export const createOrder = expressAsyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;
  const newOrder = await Order.create({
    orderItems: req.body.orderItems.map((item) => ({
      ...item,
      product: item._id,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    user: req.user._id,
  });
  res.status(201).json({ message: 'New Order Created', order: newOrder });
});

export const getSummary = expressAsyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: {
          $sum: 1,
        },
        totalSales: {
          $sum: '$totalPrice',
        },
      },
    },
  ]);

  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: {
          $sum: 1,
        },
      },
    },
  ]);

  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({ users, orders, dailyOrders, productCategories });
});

export const getOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order Not Found' });
  } else {
    res.status(200).json(order);
  }
});

export const getMyOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({ orders });
});

export const updatePayment = expressAsyncHandler(async (req, res) => {
  const { id, status, update_time, email_address } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id,
        status,
        update_time,
        email_address,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ message: 'Order Paid', order });
});

export const getOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name');
  console.log(orders);
  res.status(200).json(orders);
});

export const updateDelievery = expressAsyncHandler(async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    isDelivered: true,
    deliveredAt: Date.now(),
  });
  res.status(200).json({ message: 'Order delivered' });
});

export const deleteOrder = expressAsyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Order Deleted' });
});
