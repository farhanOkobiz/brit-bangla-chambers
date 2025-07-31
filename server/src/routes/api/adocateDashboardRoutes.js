import { Router } from "express";
import {
    getInformation
} from "../../controllers/advocateDashboardController.js";
import { checkAdvocate } from "../../middleware/authMiddleware.js";

const router = Router();

// Get advocate dashboard information
router.get("/information", checkAdvocate, getInformation);

// Export the router
export default router;

