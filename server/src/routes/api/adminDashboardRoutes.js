import { Router } from "express";
import {
    getAdminDashboardData
} from "../../controllers/adminDashboardController.js";
import { checkAdmin, protect } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect(["admin", "staff"]) , getAdminDashboardData);

export default router;