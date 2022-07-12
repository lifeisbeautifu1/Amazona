import express from 'express';
import colors from 'colors';
import mongoose from 'mongoose';
import 'express-async-handler';
import 'dotenv/config';

import seedRouter from './routes/seed.js';
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import orderRouter from './routes/order.js';
import uploadRouter from './routes/upload.js';

import authMiddleware from './middleware/auth.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', authMiddleware, orderRouter);
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`.yellow.bold)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
