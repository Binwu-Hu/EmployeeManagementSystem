import {
  createApplication,
  getApplicationStatus,
  updateApplication,
  updateApplicationStatus,
  getAllApplications,
  getApplicationDetail,
} from '../controllers/applicationController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/all', authMiddleware, getAllApplications);

router.post('/', authMiddleware, createApplication);

router.get('/', authMiddleware, getApplicationStatus);

router.get('/:id', authMiddleware, getApplicationDetail);

router.put('/', authMiddleware, updateApplication);

router.put('/:id', authMiddleware, updateApplicationStatus);

export default router;
