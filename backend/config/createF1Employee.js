import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Employee from '../models/employeeModel.js';
import VisaStatus from '../models/visaStatusModel.js';
import connectDB from '../db/index.js';

dotenv.config();
connectDB();

const newEmployees = [
  { firstName: 'Alex', lastName: 'Jones', email: 'test9@domain.com' },
  { firstName: 'Lily', lastName: 'White', email: 'test10@domain.com' },
  { firstName: 'Mark', lastName: 'Taylor', email: 'test11@domain.com' },
  { firstName: 'Sophia', lastName: 'Green', email: 'test12@domain.com' },
  { firstName: 'James', lastName: 'Walker', email: 'test13@domain.com' },
  { firstName: 'Olivia', lastName: 'Brown', email: 'test14@domain.com' },
  { firstName: 'William', lastName: 'Harris', email: 'test15@domain.com' },
  { firstName: 'Emma', lastName: 'Clark', email: 'test16@domain.com' },
];

// 随机生成不超过未来一年的日期（现在未过期）
const generateRandomDates = () => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 12)); // 起始日期最多为1年前

  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1); // 结束日期设为1年后

  return { startDate, endDate };
};

const createNewEmployeeUsers = async () => {
  try {
    for (let i = 0; i < newEmployees.length; i++) {
      const { firstName, lastName, email } = newEmployees[i];

      // Hash the password
      const hashedPassword = await bcrypt.hash('1234', 10);

      // Create the user
      const user = new User({
        username: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: 'Employee',
      });
      await user.save();
      console.log(`User Created: ${user._id}`);

      // Generate random start and end dates
      const { startDate, endDate } = generateRandomDates();

      // Create the employee
      const employee = new Employee({
        firstName,
        lastName,
        email,
        userId: user._id,
        workAuthorization: {
          visaType: 'F1',
          startDate,
          endDate,
        },
      });
      await employee.save();
      console.log(`Employee Created: ${employee._id}`);

      // Create the visa status
      const visaStatus = new VisaStatus({
        employee: employee._id,
        visaType: 'F1',
      });
      await visaStatus.save();
      console.log(`Visa Status Created for Employee: ${employee._id}`);
    }

    console.log('All new employees created successfully!');
  } catch (error) {
    console.error('Error creating new employees:', error);
  } finally {
    mongoose.connection.close();
  }
};

createNewEmployeeUsers();