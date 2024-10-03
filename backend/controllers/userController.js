import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Employee from '../models/employeeModel.js';
import RegistrationToken from '../models/registrationTokenModel.js';

// @desc Sign up new employee
// @route POST /api/users/signup
const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password, token } = req.body;
  // console.log('req.body:', req.body);

  const validToken = await RegistrationToken.findOne({ token, email });

  // something wrong with the checking?
  if (!validToken || validToken.expiresAt < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired registration token');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error('Username is already taken');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: 'Employee', // default role assignment
  });

  const employee = await Employee.create({
    username,
    email,
    userId: user._id,
  });
  console.log('Employee Created:', employee._id);

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Login user
// @route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user in the database by email
  const user = await User.findOne({ email });

  // If the user exists and the password matches (using bcrypt to compare hashes)
  if (user && (await bcrypt.compare(password, user.password))) {
    // Respond with user details and JWT token
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate JWT token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Function to generate JWT token for the user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days
  });
};

export { signupUser, loginUser };
