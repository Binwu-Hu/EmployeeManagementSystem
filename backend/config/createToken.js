import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { generateJWTToken } from '../controllers/registrationTokenController.js';
import connectDB from '../db/index.js';

dotenv.config();

// Connect to the database
connectDB();

const testGenerateToken = async () => {
  try {
    const token = await generateJWTToken('testuser@example.com');
    console.log(`Generated Token: ${token}`);
    mongoose.connection.close(); // Close the database connection after testing
  } catch (error) {
    console.error('Error generating token:', error.message);
    mongoose.connection.close();
  }
};

testGenerateToken();