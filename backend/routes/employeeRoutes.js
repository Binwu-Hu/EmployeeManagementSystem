import {
  getEmployeeByUserId,
  updateEmployee,
} from '../controllers/employeeController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/user/:id', authMiddleware, getEmployeeByUserId);

router.put('/user/:id', authMiddleware, updateEmployee);

export default router;
