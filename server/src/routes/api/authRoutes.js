import { Router } from 'express';
import { register, login, refresh, sendOtp, verifyOtp } from '../../controllers/authController.js';

const router = Router();


// OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

export default router;
