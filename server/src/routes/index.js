import { Router } from "express";
import testRoutes from "./api/testRoutes.js";
import authRoutes from "./api/authRoutes.js";
import specializationRoutes from "./api/specializationRoutes.js";
import subCategoryRoutes from "./api/subCategoryRoutes.js";
import blogRoutes from "./api/blogRoutes.js";
import contactUsRoutes from "./api/contactUsRoutes.js";
import clientRoutes from './api/clientRoutes.js';
import advocateRoutes from './api/advocateRoutes.js';

const router = Router();

// Mount all routes here
router.use("/test", testRoutes);
router.use("/auth", authRoutes);
router.use("/category", specializationRoutes);
router.use("/sub-category", subCategoryRoutes);
router.use("/blog", blogRoutes);
router.use("/contact", contactUsRoutes);
router.use('/client', clientRoutes);
router.use('/advocate', advocateRoutes)


export default router;
