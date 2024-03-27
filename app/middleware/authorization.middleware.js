
const User = require('../models/user.model');

exports.authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
