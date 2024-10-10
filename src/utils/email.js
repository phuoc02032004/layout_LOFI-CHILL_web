import { transporter } from '../config/email.js';

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `
      <h1>Verify your email</h1>
      <p>Please enter the following code to verify your email address:</p>
      <p><b>${verificationCode}</b></p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (err) {
        console.error('Error sending verification email:', err);
    }
};

export { sendVerificationEmail };
