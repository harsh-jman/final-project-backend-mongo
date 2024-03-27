const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../utils/email.utils'); 
const generatePassword = require('generate-password');

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user not found or role doesn't match, return error
        if (!user || user.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If everything is correct, generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        // Return JWT token and role in the response
        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, role } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Generate a strong random password
        const randomPassword = generatePassword.generate({
            length: 12, // Adjust the length as needed
            numbers: true,
            symbols: true,
            uppercase: true,
            strict: true // Ensure that all character types are included
        });

        // Hash the random password
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Create a new user instance
        const newUser = new User({
            firstName,
            lastName,
            email,
            role,
            password: hashedPassword // Store the hashed password
        });

        // Save the user to the database
        await newUser.save();

        // Send email with random password to the user
        await sendEmail(email, 'Welcome to YourApp - Your Random Password', `Hello ${firstName},\n\nYour account has been successfully registered.\n\nYour random password: ${randomPassword}\n\nPlease login to your account and change your password.\n\nThank you.`);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
