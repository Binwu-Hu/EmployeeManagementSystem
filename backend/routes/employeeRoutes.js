import {
  getAllEmployees,
  getEmployeeByUserId,
  updateEmployee,
  uploadEmployeeFile,
} from '../controllers/employeeController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/user/:id', authMiddleware, getEmployeeByUserId);

router.put('/user/:id', authMiddleware, updateEmployee);

router.get('/', authMiddleware, getAllEmployees);

router.post('/upload/:id', authMiddleware, upload.single('file'), uploadEmployeeFile);

export default router;
