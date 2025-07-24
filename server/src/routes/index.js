import { Router } from "express";
import serviceRoutes from "./api/serviceRoutes.js";
import testRoutes from "./api/testRoutes.js";
import authRoutes from "./api/authRoutes.js";
import specializationRoutes from "./api/specializationRoutes.js";
import subCategoryRoutes from "./api/subCategoryRoutes.js";
import blogRoutes from "./api/blogRoutes.js";
import contactUsRoutes from "./api/contactUsRoutes.js";
import requestServiceRoutes from "./api/requestServiceRoutes.js";
import advocateMessageRoutes from "./api/advocateMessageRoutes.js";
import clientRoutes from "./api/clientRoutes.js";
import advocateRoutes from "./api/advocateRoutes.js";
import caseFileRoutes from "./api/caseFileRoutes.js";

const router = Router();

// Mount all routes here
router.use("/test", testRoutes);
router.use("/auth", authRoutes);
router.use("/specialization", specializationRoutes); // This handles categories (specializations)
router.use("/sub-category", subCategoryRoutes);
router.use("/blog", blogRoutes);
router.use("/service", serviceRoutes);
router.use("/contact", contactUsRoutes);
router.use("/request-service", requestServiceRoutes);
router.use("/advocate-message", advocateMessageRoutes);
router.use("/client", clientRoutes);
router.use("/advocate", advocateRoutes);
router.use("/caseFile", caseFileRoutes);

export default router;
