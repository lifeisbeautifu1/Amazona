import expressAsyncHandler from 'express-async-handler';
import User from '../models/user.js';
import { generateToken } from '../utils.js';
import bcrypt from 'bcryptjs';

export const signin = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    }
  }
  return res.status(401).json({ message: 'Invalid email or password' });
});

export const signup = expressAsyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  res.status(200).json({
    name: user.name,
    _id: user._id,
    email: user._id,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
});
