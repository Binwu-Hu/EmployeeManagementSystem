import mongoose, { connect } from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Employee from '../models/employeeModel.js';
import VisaStatus from '../models/visaStatusModel.js';
import connectDB from '../db/index.js';

dotenv.config();
connectDB();

const usersData = [
  { firstName: 'John', lastName: 'Doe', email: 'test1@domain.com' },
  { firstName: 'Jane', lastName: 'Smith', email: 'test2@domain.com' },
  { firstName: 'Mike', lastName: 'Johnson', email: 'test3@domain.com' },
  { firstName: 'Emily', lastName: 'Davis', email: 'test4@domain.com' },
  { firstName: 'David', lastName: 'Brown', email: 'test5@domain.com' },
  { firstName: 'Sarah', lastName: 'Miller', email: 'test6@domain.com' },
  { firstName: 'Chris', lastName: 'Wilson', email: 'test7@domain.com' },
  { firstName: 'Anna', lastName: 'Taylor', email: 'test8@domain.com' },
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
        workAuthorization: {
          visaType: 'F1',
        },
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
