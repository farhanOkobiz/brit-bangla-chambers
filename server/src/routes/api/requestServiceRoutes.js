import { Router } from "express";
const router = Router();
import {
  createRequestService,
  getAllRequestServices,
  deleteRequestService,
} from "../../controllers/requestServiceController.js";

router.post("/", createRequestService);
router.get("/", getAllRequestServices);
router.delete("/:id", deleteRequestService);

export default router;
