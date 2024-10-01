import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Employee from '../models/employeeModel.js';
import RegistrationToken from '../models/registrationTokenModel.js';

// @desc Sign up new employee
// @route POST /api/users/signup
const signupUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, token } = req.body;

  // If the role is 'Employee', validate the registration token
  if (role === 'Employee') {
    const validToken = await RegistrationToken.findOne({ token, email });
    if (!validToken || validToken.expiresAt < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired registration token');
    }
    // If token is valid, delete it after usage
    await RegistrationToken.deleteOne({ token });
  }

  // Check if user with the same email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user in the database
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  // If user creation is successful and the role is 'Employee', create an Employee entry
  if (user && role === 'Employee') {
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      userId: user._id, // Reference the created user's ID
      // You can add more default fields or handle additional data here
    });
    console.log('Employee Created:', employee._id);
  }

  // If user creation is successful, respond with the user details and JWT token
  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate JWT token
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
