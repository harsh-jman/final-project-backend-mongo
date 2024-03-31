const User = require("../models/user.model");

exports.getAllData = async (req, res) => {
  try {
    // Fetch all data from the database
    const allData = await User.find();

    // Return the data as the response
    res.status(200).json({ data: allData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserData = async (req, res) => {
    try {
      // Extract user ID from the decoded JWT token
      const userId = req.user.userId;
  
      // Fetch user data based on the extracted user ID
      const userData = await User.findById(userId);
  
      // If user data is found, send it in the response
      if (userData) {
        res.status(200).json({ userData });
      } else {
        res.status(404).json({ message: 'User data not found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};