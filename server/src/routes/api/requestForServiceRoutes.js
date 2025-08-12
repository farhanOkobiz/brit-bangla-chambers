import { Router } from "express";
const router = Router();
import { checkAdmin, checkAdvocate, checkClient } from "../../middleware/authMiddleware.js";
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
router.patch("/accepted/:id", checkAdvocate, acceptedRequestStatus);
router.patch("/rejected/:id", checkAdvocate, rejectedRequestStatus);
router.delete("/:id", checkAdmin, deleteRequestService);

export default router;
