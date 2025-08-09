import { Router } from "express";
import upload from "../../middleware/multerMiddleware.js";
import {
  createFileRequest,
  updateFileRequest,
  deleteFileRequest,
  uploadFilesToRequest,
  getAllFileRequests,
  getFileRequestByClintId,
  getFileRequestByCaseId,
  deleteSingleDocumentsFromRequest,
} from "../../controllers/fileRequestController.js";
import { checkClient, protect } from "../../middleware/authMiddleware.js";

const router = Router();

// Specific routes FIRST
router.post(
  "/",
  protect(["admin", "staff", "advocate"]),
  upload.array("files"),
  createFileRequest
);
router.put(
  "/:id/upload",
  checkClient,
  upload.array("files"),
  uploadFilesToRequest
);
router.get("/case/:_id", getFileRequestByCaseId);

// Then parameterized routes
router.get("/", getAllFileRequests);
router.get("/clientId", checkClient, getFileRequestByClintId);
router.put("/:id", upload.array("files"), updateFileRequest);
router.delete(
  "/:id",
  protect(["admin", "advocate", "staff"]),
  deleteFileRequest
);
router.delete("/:_id/file", deleteSingleDocumentsFromRequest);

export default router;
