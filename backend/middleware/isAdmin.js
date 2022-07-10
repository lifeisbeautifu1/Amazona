const isAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

export default isAdminMiddleware;
