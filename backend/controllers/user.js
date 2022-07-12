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
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
});

export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(401).json({ message: 'Not all fields provided' });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      password: hashedPassword,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    name: user.name,
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
});

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export const getUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json('User not found');
  }
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted' });
});