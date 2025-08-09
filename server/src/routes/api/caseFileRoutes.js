import express from "express";
import {
  addDocumentToCaseFile,
  changeCaseFileStatus,
  createCaseFile,
  getAllCaseFilesForAdmin,
  getAllCaseFilesForAdvocate,
  getCaseFileForClient,
  getSingleCaseFileById,
  updateCaseFile,
  deleteDocumentFromCaseFile,
  updateDocumentTitleInCaseFile,
  getDocumentsFromCaseFile,
  deleteCaseFile,
  uploadDocumet,
} from "../../controllers/caseFileController.js";
import {
  checkAdmin,
  checkAdvocate,
  checkClient,
  protect,
} from "../../middleware/authMiddleware.js";
import upload from "../../middleware/multerMiddleware.js";

const router = express.Router();

router.post(
  "/createCaseFile",
  protect(["advocate", "staff", "advocate"]),
  createCaseFile
); // Create case
router.get(
  "/allCaseFile",
  protect(["admin", "Staff", "advocate"]),
  getAllCaseFilesForAdvocate
); // Get all cases
router.get(
  "/allCaseFile/for-admin",
  protect(["admin", "staff"]),
  getAllCaseFilesForAdmin
); // Get all cases for admin
router.get(
  "/allCaseFile/for-client",
  protect(["admin", "Staff", "advocate", "client"]),
  getCaseFileForClient
); // Get single case for client
router.get(
  "/singleCaseFile/:id",
  protect(["admin", "staff", "advocate", "client"]),
  getSingleCaseFileById
);
router.put(
  "/updateCaseFile/:id",
  protect(["admin", "staff", "advocate"]),
  updateCaseFile
); // Update case
router.delete("/deleteCaseFile/:id", checkAdmin, deleteCaseFile); // Delete case
router.post("/changeStatus/:id", changeCaseFileStatus);
router.post("/document/:id/add-document", addDocumentToCaseFile); // Add document to case file
router.get("/document/:id", getDocumentsFromCaseFile); // Get single case file with documents
router.delete("/deleteCaseFile/:id", protect(["admin"]), deleteCaseFile); // Delete case
router.post(
  "/changeStatus/:id",
  protect(["admin", "staff", "advocate"]),
  changeCaseFileStatus
);
router.post(
  "/document/:id/add-document",
  protect(["admin", "staff", "advocate"]),
  addDocumentToCaseFile
); // Add document to case file
router.get(
  "/document/:id",
  protect(["admin", "staff", "advocate"]),
  getDocumentsFromCaseFile
); // Get single case file with documents
router.delete(
  "/deleteDocument/:id/documents/:docId",
  protect(["admin", "staff", "advocate"]),
  deleteDocumentFromCaseFile
); // Delete document from case file
//update document title
router.put(
  "/updateDocument/:id/documents/:docId",
  protect(["admin", "staff", "advocate"]),
  updateDocumentTitleInCaseFile
); // Update document title in case file

router.use(
  "/uploadDocument/:id",
  protect(["admin", "staff", "advocate"]),
  upload.single("file"), // Use multer middleware to handle file uploads
  uploadDocumet
);

export default router;
