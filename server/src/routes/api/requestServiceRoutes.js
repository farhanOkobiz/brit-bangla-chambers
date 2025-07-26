import { Router } from "express";
const router = Router();
import {
  createRequestService,
  getAllRequestServices,
  acceptedRequestStatus,
  rejectedRequestStatus,
  deleteRequestService,
} from "../../controllers/requestServiceController.js";
import { checkClient } from "../../middleware/authMiddleware.js";

router.post("/", checkClient, createRequestService);
router.get("/", getAllRequestServices);
router.patch("/accepted/:id", acceptedRequestStatus);
router.patch("/rejected/:id", rejectedRequestStatus);
router.delete("/:id", deleteRequestService);

export default router;
