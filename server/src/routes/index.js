import { Router } from 'express';
import testRoutes from './api/testRoutes.js';
import authRoutes from './api/authRoutes.js';

const router = Router();

// Mount all routes here
router.use('/test', testRoutes);
router.use('/auth', authRoutes);


export default router;
