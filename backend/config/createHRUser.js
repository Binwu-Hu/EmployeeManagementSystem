import mongoose, { connect } from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import connectDB from '../db/index.js';

dotenv.config();
connectDB();

const createHRUser = async () => {
  const hashedPassword = await bcrypt.hash('YourHRPassword', 10);
  
  const hrUser = new User({
    firstName: 'HR',
    lastName: 'Manager',
    email: 'hr@example.com',
    password: hashedPassword,
    role: 'HR',
  });

  await hrUser.save();
  console.log('HR User Created');
  mongoose.connection.close();
};

createHRUser();