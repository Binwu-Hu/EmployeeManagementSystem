import mongoose, { connect } from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Employee from '../models/employeeModel.js'; 
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
  console.log('HR User Created:', hrUser._id);


  const hrEmployee = new Employee({
    firstName: 'HR',
    lastName: 'Manager',
    email: 'hr@example.com',
    userId: hrUser._id,
  });

  await hrEmployee.save();
  console.log('HR Employee Created');
  mongoose.connection.close();
};

createHRUser();