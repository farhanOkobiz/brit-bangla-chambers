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

router.post("/", protect(["client", "advocate", "staff"]), createHelpRequest);
router.get("/", protect(["admin", "staff"]), getAllHelpRequests);
router.get("/my-requests", protect(["client", "advocate", "staff"]), getMyHelpRequests); 
router.get("/:id", protect(["admin", "staff"]), getHelpRequestById);
router.put("/:id/status", protect(["admin", "staff"]), updateHelpRequestStatus);
router.delete("/:id", checkAdmin, deleteHelpRequest);


export default router;