import express from "express";
import {
  addDocumentToCaseFile,
  changeCaseFileStatus,
  createCaseFile,
  deleteCaseFile,
  getAllCaseFilesForAdmin,
  getAllCaseFilesForAdvocate,
  getCaseFileForClient,
  getSingleCaseFileById,
  updateCaseFile,
  deleteDocumentFromCaseFile,
  updateDocumentTitleInCaseFile,
  getDocumentsFromCaseFile,
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

router.post("/createCaseFile", protect(["advocate", "client"]), createCaseFile); // Create case
router.get("/allCaseFile", checkAdvocate, getAllCaseFilesForAdvocate); // Get all cases
router.get(
  "/allCaseFile/for-admin",
  protect(["admin", "staff"]),
  getAllCaseFilesForAdmin
); // Get all cases for admin
router.get("/allCaseFile/for-client", checkClient, getCaseFileForClient); // Get single case for client
router.get("/singleCaseFile/:id", getSingleCaseFileById);
router.put(
  "/updateCaseFile/:id",
  protect(["admin", "staff", "advocate"]),
  updateCaseFile
); // Update case
router.delete("/deleteCaseFile/:id", checkAdvocate, deleteCaseFile); // Delete case
router.post("/changeStatus/:id", changeCaseFileStatus);
router.post("/document/:id/add-document", addDocumentToCaseFile); // Add document to case file
router.get("/document/:id", getDocumentsFromCaseFile); // Get single case file with documents
router.delete(
  "/deleteDocument/:id/documents/:docId",
  deleteDocumentFromCaseFile
); // Delete document from case file
//update document title
router.put(
  "/updateDocument/:id/documents/:docId",
  updateDocumentTitleInCaseFile
); // Update document title in case file

router.use(
  "/uploadDocument/:id",
  protect(["admin", "staff", "advocate"]),upload.single("file"), // Use multer middleware to handle file uploads
  uploadDocumet
);

export default router;
