import {
  createApplication,
  getApplicationStatus,
  updateApplication,
  updateApplicationStatus,
  getAllApplications,
  getApplicationById,
} from '../controllers/applicationController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/', authMiddleware, createApplication);

router.get('/', authMiddleware, getApplicationStatus);

router.get('/:id/view', authMiddleware, getApplicationById);

router.put('/:id', authMiddleware, updateApplication);

router.put('/', authMiddleware, updateApplicationStatus);

router.get('/all', authMiddleware, getAllApplications);

export default router;
