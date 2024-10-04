import {
  getAllEmployees,
  getEmployeeByUserId,
  updateEmployee
} from '../controllers/employeeController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/user/:id', authMiddleware, getEmployeeByUserId);

router.put('/user/:id', authMiddleware, updateEmployee);

router.get('/', authMiddleware, getAllEmployees);

export default router;
