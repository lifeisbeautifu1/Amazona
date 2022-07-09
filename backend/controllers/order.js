import expressAsyncHandler from 'express-async-handler';
import Order from '../models/order.js';

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

export const getOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order Not Found' });
  } else {
    res.status(200).json(order);
  }
});
