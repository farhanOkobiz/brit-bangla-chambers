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
  deleteSingleFileFromRequest,
} from "../../controllers/fileRequestController.js";
import { checkClient } from "../../middleware/authMiddleware.js";

const router = Router();

// Specific routes FIRST
router.post("/", upload.array("files"), createFileRequest);
router.put("/upload", checkClient, upload.array("files"), uploadFilesToRequest);
router.get("/case/:_id", getFileRequestByCaseId);

// Then parameterized routes
router.get("/", getAllFileRequests);
router.get("/:_id", getFileRequestById);
router.put("/:id", upload.array("files"), updateFileRequest);
router.delete("/:id", deleteFileRequest);
router.delete("/:_id/file", deleteSingleFileFromRequest);

export default router;
