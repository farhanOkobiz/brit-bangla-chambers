import { Router } from "express";

const router = Router();

import {
    createHelpRequest,
    getAllHelpRequests,
    updateHelpRequestStatus,
    deleteHelpRequest,
    getHelpRequestById,
    getMyHelpRequests
} from "../../controllers/helpAndSupportController.js";
import { checkAdmin, checkClient , protect} from "../../middleware/authMiddleware.js";

router.post("/", protect(["client", "advocate"]), createHelpRequest);
router.get("/", checkAdmin, getAllHelpRequests);
router.get("/my-requests", protect(["client", "advocate"]), getMyHelpRequests); 
router.get("/:id", checkAdmin, getHelpRequestById);
router.put("/:id/status", checkAdmin, updateHelpRequestStatus);
router.delete("/:id", checkAdmin, deleteHelpRequest);


export default router;