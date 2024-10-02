import express from 'express';
import { uploadVisaDocuments, getVisaStatusByEmployee, approveOrRejectVisaDocument, sendNotification } from '../controllers/visaStatusController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Employee Upload Visa Document
router.post('/upload/:employeeId', authMiddleware, uploadVisaDocuments);

// Get Visa Status by Employee
router.get('/:employeeId', authMiddleware, getVisaStatusByEmployee);

// HR Approves or Rejects Documents
router.patch('/approve/:employeeId', authMiddleware, approveOrRejectVisaDocument);

// HR Sends Notification
router.post('/notify/:employeeId', authMiddleware, sendNotification);

export default router;