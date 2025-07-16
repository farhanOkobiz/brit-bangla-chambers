import { Router } from 'express';
import testRoutes from './api/testRoutes.js';
import authRoutes from './api/authRoutes.js';
import categoryRoutes from './api/categoryRoutes.js';
import subCategoryRoutes from './api/subCategoryRoutes.js';
import blogRoutes from './api/blogRoutes.js';

const router = Router();

// Mount all routes here
router.use('/test', testRoutes);
router.use('/auth', authRoutes);
router.use("/category", categoryRoutes);
router.use("/sub-category", subCategoryRoutes);
router.use("/blog", blogRoutes); 

export default router;
