
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
};

// Authorization Middleware for Admins
const authorizeAdmin = async (req, res, next) => {
  const shoppingList = await ShoppingList.findById(req.params.id);
  if (!shoppingList) return res.status(404).json({ error: 'Shopping list not found' });

  const isAdmin = shoppingList.admins.includes(req.user.id) || shoppingList.ownerId.toString() === req.user.id;
  if (!isAdmin) return res.status(403).json({ error: 'Unauthorized' });

  next();
};

module.exports = { authenticate, authorizeAdmin };
