import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import sgMail from '@sendgrid/mail';
import RegistrationToken from '../models/registrationTokenModel.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc Generate a JWT registration token for the provided email
// @param email - The email for which to generate the registration token
const generateJWTToken = asyncHandler(async (email, firstName, lastName) => {
  // Create JWT Token (expires in 30 days)
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' });

  // Calculate the expiration date
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

  // Save the JWT token in the database
  const newToken = await RegistrationToken.create({
    token,
    email,
    firstName,
    lastName,
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
  const { email, firstName, lastName } = req.body;
  const frontendUrl = req.headers['frontend_url'];
  console.log('req.body:', req.body);
  // Generate JWT token for the email
  const token = await generateJWTToken(email, firstName, lastName);

  // Construct the registration link
  const registrationLink = `${frontendUrl}/signup/${token}`;
  console.log('registrationLink:', registrationLink);
  // Email content
  const message = `
    <p>Hi ${firstName},</p>
    <p>Please use the following link to complete your registration:</p>
    <a href="${registrationLink}">${registrationLink}</a>
    <p>The link will expire in 30 days.</p>
  `;

  // Send the email via SendGrid
  try {
    await sgMail.send({
      to: email,
      from: 'ecommercemanagementchuwa@gmail.com',
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
