const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Assuming 'admin' and 'user' are the roles
    default: 'user' // Default role is 'user'
  },
  password: {
    type: String,
    required: false // Assuming you'll store the password in the database
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
