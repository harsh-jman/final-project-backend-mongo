const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const seedAdminOnce = async (mongoURL) => {
  try {
    // Set up MongoDB connection
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Check if there are any existing admins
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Read admin credentials from environment variables
    const firstName = process.env.ADMIN_FIRST_NAME;
    const lastName = process.env.ADMIN_LAST_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const designation = process.env.ADMIN_DESIGNATION

    // Ensure all required environment variables are provided
    if (!firstName || !lastName || !email || !password) {
      console.error('Missing required environment variables for admin credentials');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user instance
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      role: 'admin',
      password: hashedPassword, // Store the hashed password
      designation : designation
    });

    // Save the admin user to the database
    await newAdmin.save();

    console.log('Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = seedAdminOnce;
