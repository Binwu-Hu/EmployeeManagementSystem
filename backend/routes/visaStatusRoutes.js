import express from 'express';
import { uploadVisaDocuments, getVisaStatusByEmployee, approveOrRejectVisaDocument, sendNotification } from '../controllers/visaStatusController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);  
    }
  });
  console.log('storage:', storage);
  
  const upload = multer({ storage: storage });

const router = express.Router();

// Employee Upload Visa Document
router.post('/upload/:employeeId', authMiddleware, upload.array('files'), uploadVisaDocuments);

// Get Visa Status by Employee
router.get('/:employeeId', authMiddleware, getVisaStatusByEmployee);

// HR Approves or Rejects Documents
router.patch('/approve/:employeeId', authMiddleware, approveOrRejectVisaDocument);

// HR Sends Notification
router.post('/notify/:employeeId', authMiddleware, sendNotification);

export default router;