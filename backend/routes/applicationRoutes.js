import {
  createApplication,
  getApplicationStatus,
  updateApplication,
  updateApplicationStatus,
  getAllApplications,
  getApplicationDetail,
  getTokenList,
} from '../controllers/applicationController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/tokenlist', authMiddleware, getTokenList);

router.get('/all', authMiddleware, getAllApplications);

router.get('/:id', authMiddleware, getApplicationDetail);

router.put('/:id', authMiddleware, updateApplicationStatus);

router.post('/', authMiddleware, createApplication);

router.get('/', authMiddleware, getApplicationStatus);

router.put('/', authMiddleware, updateApplication);

export default router;
