import { Router } from "express";
import upload from "../../middleware/multerMiddleware.js";
import {
  createFileRequest,
  updateFileRequest,
  deleteFileRequest,
  uploadFilesToRequest,
  getAllFileRequests,
  getFileRequestById,
  getFileRequestByCaseId,
} from "../../controllers/fileRequestController.js";

const router = Router();

// ✅ Advocate creates a file request
router.post("/", upload.array("files"), createFileRequest);

// ✅ Get all requests (optionally filtered by advocate_id/client_id)
router.get("/", getAllFileRequests);

// ✅ Get a single request by ID
router.get("/:_id", getFileRequestById);
router.get("/case/:_id", getFileRequestByCaseId);

// ✅ Advocate updates the request (title/description/files)
router.put("/:id", upload.array("files"), updateFileRequest);

// ✅ Client uploads files to an existing request
router.put("/:id/upload", upload.array("files"), uploadFilesToRequest);

// ✅ Delete a request
router.delete("/:id", deleteFileRequest);

export default router;
