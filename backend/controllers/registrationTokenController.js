import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import RegistrationToken from '../models/registrationTokenModel.js';

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

export { generateJWTToken };
