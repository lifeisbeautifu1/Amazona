import express from 'express';

import {
  signin,
  signup,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.js';

import isAuth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/signin', signin);

router.post('/signup', signup);

router.get('/', isAuth, isAdmin, getAllUsers);

router.get('/:id', isAuth, isAdmin, getUser);

router.delete('/:id', isAuth, isAdmin, deleteUser);

router.patch('/profile', isAuth, updateProfile);

router.patch('/:id', isAuth, isAdmin, updateUser);


export default router;
