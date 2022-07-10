import express from 'express';

import { signin, signup, updateProfile } from '../controllers/user.js';

import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/signin', signin);

router.post('/signup', signup);

router.patch('/profile', authMiddleware, updateProfile);

export default router;
