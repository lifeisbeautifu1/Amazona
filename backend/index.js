import express from 'express';
import colors from 'colors';
import mongoose from 'mongoose';
import 'dotenv/config';

import seedRouter from './routes/seed.js';
import productRouter from './routes/product.js';

const app = express();
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);

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
