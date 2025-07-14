import { Router } from 'express';
import testRoutes from './api/testRoutes.js';

const router = Router();

// Mount all routes here
router.use('/test', testRoutes);

export default router;
