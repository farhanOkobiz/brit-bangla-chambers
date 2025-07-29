import { Router } from "express";
import { checkClient } from "../../middleware/authMiddleware.js";
import { getSomeInfoFromCaseFile } from "../../controllers/clientDashboardController.js";

const router = Router();

router.get("/some-info-form-case", checkClient, getSomeInfoFromCaseFile);

export default router;
