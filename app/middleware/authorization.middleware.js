const jwt = require('jsonwebtoken');

exports.verifyAdminRole = async (req, res, next) => {
  try {
    // Extract JWT token from the request headers
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
    const tokenValue = token.split(' ')[1];
    // Verify JWT token
    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }

      // Extract userId and role from the decoded token
      const { userId, role } = decoded;
      

      // Check if the user has the role of "admin"
      if (role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden - Admin access required' });
      }

      // If the user has the role of "admin", allow access to the route
      next();
    });
  } catch (error) {
    console.error('Error verifying admin role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
