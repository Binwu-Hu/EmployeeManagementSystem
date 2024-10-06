import applicationRoutes from './routes/applicationRoutes.js';
import connectDB from './db/index.js';
import cors from 'cors'
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.js';
import express from 'express';
import path from 'path';
import registrationRoutes from './routes/registrationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import visaStatusRoutes from './routes/visaStatusRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, 
}));

// Middleware to handle JSON data
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// User Routes
// /user? /users?
app.use('/api/user', userRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/visa-status', visaStatusRoutes);
app.use('/api/employees', employeeRoutes);

// Serve static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, 'static')));


app.use(errorHandlerMiddleware);
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
