const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
    try {
        // Retrieve SMTP credentials from environment variables
        const smtpConfig = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        };

        // Configure nodemailer with SMTP settings
        const transporter = nodemailer.createTransport(smtpConfig);

        // Email content
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to,
            subject,
            text
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
