import { Router } from 'express';
import { showProfile } from '../../controllers/authController.js';
import { checkClient } from '../../middleware/authMiddleware.js';

const router = Router();

// OTP routes
router.get('/profile', checkClient, showProfile);
export default router;
