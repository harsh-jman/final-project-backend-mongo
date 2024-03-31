const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/email.utils");
const generatePassword = require("generate-password");
const mongoose = require("mongoose");

exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      // If user not found, return error
      if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // If the user's forcePasswordReset flag is true, return a response indicating password reset is required
      if (user.forcePasswordReset) {
          return res.status(200).json({ message: "Force password reset required", forcePasswordReset: true });
      }

      // If everything is correct, generate JWT token
      const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Token expiration time
      );

      // Return JWT token and role in the response
      res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

exports.register = async (req, res) => {
  let session; // Declare a variable to hold the session

  try {
    const { firstName, lastName, email, role ,designation} = req.body;

    // Start a new database session
    session = await mongoose.startSession();
    session.startTransaction();

    // Check if the email already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate a strong random password
    const randomPassword = generatePassword.generate({
      length: 16, // Adjust the length as needed
      numbers: true,
      symbols: true,
      uppercase: true,
      strict: true, // Ensure that all character types are included
    });

    // Hash the random password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword, // Store the hashed password
      designation,
    });

    // Save the user to the database (within the session)
    await newUser.save({ session });

    const loginUrl = process.env.LOGIN_PAGE_URL;
    // Send email with random password to the user
    await sendEmail(
      email,
      "Welcome to YourApp - Your One Time Login Credential",
      `Hello Dear,\n\n Your account has been successfully registered.\n\nYour email: ${email}\n\nYour One-Time password: ${randomPassword}\nPlease visit the login page (${loginUrl}) to login and change your password.\n\nThank you.
      `
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "User registered successfully",
      emailStatus: "success",
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Rollback the transaction if an error occurs
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    res
      .status(500)
      .json({ message: "Internal server error", emailStatus: "fail" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Extract email from request body
    const email = req.body.email;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    // Update user details (first name, last name, role, isActive)
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.designation = req.body.designation || user.designation;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive || user.isActive;


    // Save the updated user details
    await user.save();

    // Return success message
    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Extract email from request body
    const email = req.body.email;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.deleteOne({ email });

    // Return success message
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};