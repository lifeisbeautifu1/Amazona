import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return res.status(401).json({ message: 'Token not provided' });
  const token = req.headers.authorization.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

export default authMiddleware;
