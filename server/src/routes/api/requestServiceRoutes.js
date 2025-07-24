import { Router } from "express";
const router = Router();
import {
  createRequestService,
  getAllRequestServices,
  deleteRequestService,
} from "../../controllers/requestServiceController.js";
import { checkClient } from "../../middleware/authMiddleware.js";

router.post("/", checkClient, createRequestService);
router.get("/", getAllRequestServices);
router.delete("/:id", deleteRequestService);

export default router;
