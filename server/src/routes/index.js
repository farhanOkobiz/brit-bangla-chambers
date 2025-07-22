import { Router } from "express";
import testRoutes from "./api/testRoutes.js";
import authRoutes from "./api/authRoutes.js";
import categoryRoutes from "./api/categoryRoutes.js";
import subCategoryRoutes from "./api/subCategoryRoutes.js";
import blogRoutes from "./api/blogRoutes.js";
import contactUsRoutes from "./api/contactUsRoutes.js";
import requestServiceRoutes from "./api/requestServiceRoutes.js";
import advocateMessageRoutes from "./api/advocateMessageRoutes.js";
import clientRoutes from "./api/clientRoutes.js";

const router = Router();

// Mount all routes here
router.use("/test", testRoutes);
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/sub-category", subCategoryRoutes);
router.use("/blog", blogRoutes);
router.use("/contact", contactUsRoutes);
router.use("/request-service", requestServiceRoutes);
router.use("/advocate-message", advocateMessageRoutes);
router.use("/client", clientRoutes);

export default router;
