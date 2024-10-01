import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware to handle JSON data
app.use(express.json());

// User Routes
app.use('/api/user', userRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});