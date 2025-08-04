import { Router } from "express";
const router = Router();
import { checkClient } from "../../middleware/authMiddleware.js";
import upload from "../../middleware/multerMiddleware.js";
import {
  acceptedRequestStatus,
  createRequestService,
  deleteRequestService,
  getAllRequestServices,
  rejectedRequestStatus,
} from "../../controllers/requestForServiceController.js";

// Use the shared multer middleware for documents (PDFs/images)
router.post(
  "/",
  checkClient,
  upload.array("attachments"),
  createRequestService
);
router.get("/", getAllRequestServices);
router.patch("/accepted/:id", acceptedRequestStatus);
router.patch("/rejected/:id", rejectedRequestStatus);
router.delete("/:id", deleteRequestService);

export default router;
