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

router.post('/', authMiddleware, createApplication);

router.get('/', authMiddleware, getApplicationStatus);

router.get('/:id', authMiddleware, getApplicationDetail);

router.put('/', authMiddleware, updateApplication);

router.put('/:id', authMiddleware, updateApplicationStatus);

router.get('/all', authMiddleware, getAllApplications);

export default router;
