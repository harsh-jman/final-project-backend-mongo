const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.authenticate = (req, res, next) => {
    // Check if token is present in request headers
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
  
    // Check if token starts with "Bearer "
    if (!token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
    }
  
    // Extract the token value (remove "Bearer " prefix)
    const tokenValue = token.split(' ')[1];
  
    // Verify token
    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }
  
      req.user = decoded;
      next();
    });
  };