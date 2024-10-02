import express from 'express';
import { getEmployeeByEmail } from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get employee details by email
router.get('/me', authMiddleware, getEmployeeByEmail);

export default router;