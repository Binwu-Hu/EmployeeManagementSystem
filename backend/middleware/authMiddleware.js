import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  const token = 
    req.header('x-auth-token') || req.headers?.authorization?.match(/^Bearer (.+)/)?.[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = await User.findById(decoded.id).select('-password'); // Get user data without the password
    if (!req.user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    next(); // Continue to the next middleware/route handler
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};