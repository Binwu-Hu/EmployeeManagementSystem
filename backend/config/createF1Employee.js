import mongoose, { connect } from 'mongoose';

import Employee from '../models/employeeModel.js';
import User from '../models/userModel.js';
import VisaStatus from '../models/visaStatusModel.js';
import bcrypt from 'bcryptjs';
import connectDB from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const usersData = [
  { firstName: 'John', lastName: 'Doe', email: 'test20@domain.com' },
  { firstName: 'John', lastName: 'Doe', email: 'test21@domain.com' },
  { firstName: 'Jane', lastName: 'Smith', email: 'test22@domain.com' },
  { firstName: 'Mike', lastName: 'Johnson', email: 'test23@domain.com' },
  { firstName: 'Emily', lastName: 'Davis', email: 'test24@domain.com' },
  { firstName: 'David', lastName: 'Brown', email: 'test25@domain.com' },
  { firstName: 'Sarah', lastName: 'Miller', email: 'test26@domain.com' },
  { firstName: 'Chris', lastName: 'Wilson', email: 'test27@domain.com' },
  { firstName: 'Anna', lastName: 'Taylor', email: 'test28@domain.com' },
];

const createEmployeeUsers = async () => {
  try {
    for (let i = 0; i < usersData.length; i++) {
      const { firstName, lastName, email } = usersData[i];

      // Hash password
      const hashedPassword = await bcrypt.hash('1234', 10);

      // Create new user
      const user = new User({
        username: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: 'Employee',
      });
      await user.save();
      console.log(`User Created: ${user._id}`);

      // Create employee associated with the user
      const employee = new Employee({
        firstName,
        lastName,
        email,
        userId: user._id,
      });
      await employee.save();
      console.log(`Employee Created: ${employee._id}`);

      // Create visa status for employee
      const visaStatus = new VisaStatus({
        employee: employee._id,
        visaType: 'F1',
      });
      await visaStatus.save();
      console.log(`Visa Status Created for Employee: ${employee._id}`);
    }

    console.log('All users created successfully!');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    mongoose.connection.close();
  }
};

createEmployeeUsers();
