import { Router } from 'express';
import { register, login, refresh, sendOtp, verifyOtp,checkAuth, showAllUsers } from '../../controllers/authController.js';
import { checkAdmin } from '../../middleware/authMiddleware.js';

const router = Router();


// OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/check', checkAuth);
router.get('/users', checkAdmin, showAllUsers)

export default router;
