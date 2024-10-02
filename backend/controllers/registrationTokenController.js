import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import sgMail from '@sendgrid/mail';
import RegistrationToken from '../models/registrationTokenModel.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc Generate a JWT registration token for the provided email
// @param email - The email for which to generate the registration token
const generateJWTToken = asyncHandler(async (email) => {
  // Create JWT Token (expires in 24 hours)
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

  // Calculate the expiration date
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  // Save the JWT token in the database
  const newToken = await RegistrationToken.create({
    token,
    email,
    expiresAt,
  });

  if (newToken) {
    console.log('Generated JWT Token:', newToken.token); 
    return newToken.token;
  } else {
    throw new Error('Failed to generate registration token');
  }
});

// @desc Send registration link via email
// @route POST /api/registration/send
const sendRegistrationLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const frontendUrl = req.headers['frontend_url'];
  // Generate JWT token for the email
  const token = await generateJWTToken(email);

  // Construct the registration link
  const registrationLink = `${frontendUrl}/signup/${token}`;

  // Email content
  const message = `
    <p>Hello,</p>
    <p>Please use the following link to complete your registration:</p>
    <a href="${registrationLink}">${registrationLink}</a>
    <p>The link will expire in 24 hours.</p>
  `;

  // Send the email via SendGrid
  try {
    await sgMail.send({
      to: email,
      from: 'ecommercemanagementchuwa@gmail.com',  // Your verified sender email
      subject: 'Complete your registration',
      html: message,
    });

    res.status(200).json({ message: 'Registration link sent successfully' });
  } catch (error) {
    console.error('Error sending registration email:', error);
    res.status(500).json({ message: 'Failed to send registration link' });
  }
});

export { generateJWTToken, sendRegistrationLink };
