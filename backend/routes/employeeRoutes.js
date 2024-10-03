import express from 'express';
import {
  getEmployeeByEmail,
  updateEmployeeProfile,
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get employee details by email
router.get('/me', authMiddleware, getEmployeeByEmail);

router.put('/', authMiddleware, updateEmployeeProfile);

export default router;
