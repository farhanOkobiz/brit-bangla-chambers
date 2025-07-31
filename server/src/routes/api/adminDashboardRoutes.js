import { Router } from "express";
import {
    getAdminDashboardData
} from "../../controllers/adminDashboardController.js";
import { checkAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/", checkAdmin, getAdminDashboardData);

export default router;