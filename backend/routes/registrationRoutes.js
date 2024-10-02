import express from 'express';
import { sendRegistrationLink } from '../controllers/registrationTokenController.js';

const router = express.Router();

// @route POST /api/registration/send
router.post('/send', sendRegistrationLink);

export default router;