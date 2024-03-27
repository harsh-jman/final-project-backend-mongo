const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const generatePassword = require("generate-password");
const { sendEmail } = require('../utils/email.utils');
const mongoose = require("mongoose");


// Custom function to validate password strength
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
    return regex.test(password);
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword, confirmPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Check if the current password provided matches the user's actual password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', message: 'Incorrect current password' });
        }

        // Check if the new password matches the confirmed password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ status: 'error', message: 'New password and confirm password do not match' });
        }

        // Validate the strength of the new password
        if (!validatePassword(newPassword)) {
            return res.status(400).json({ status: 'error', message: 'New password does not meet the required criteria' });
        }

        // Update user's password and forcePasswordChange flag
        user.password = await bcrypt.hash(newPassword, 10);
        user.forcePasswordReset = false; // Set forcePasswordChange to false
        await user.save();

        res.status(200).json({ status: 'success', message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    let session; // Declare a variable to hold the session

    try {
        const { email } = req.body;

        // Start a new database session
        session = await mongoose.startSession();
        session.startTransaction();

        // Find the user by email
        const user = await User.findOne({ email }).session(session);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
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

        // Update user's password and set forcePasswordReset flag
        user.password = hashedPassword;
        user.forcePasswordReset = true;
        await user.save({ session });

        // Send email with the new password
        await sendEmail(
            email,
            'Password Reset Request',
            `Your new password: ${randomPassword}\n\nPlease reset your password after logging in.`,
            session
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ status: 'success', message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error handling forgot password request:', error);

        // Rollback the transaction if an error occurs
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};





