import express from "express";
import {
  createCaseFile,
  deleteCaseFile,
  getAllCaseFilesForAdmin,
  getAllCaseFilesForAdvocate,
  getCaseFileForClient,
  getSingleCaseFileById,
  updateCaseFile,
} from "../../controllers/caseFileController.js";
import {
  checkAdmin,
  checkAdvocate,
  checkClient,
  protect,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCaseFile", protect(["advocate", "client"]), createCaseFile); // Create case
router.get("/allCaseFile", checkAdvocate, getAllCaseFilesForAdvocate); // Get all cases
router.get("/allCaseFile/for-admin", checkAdmin, getAllCaseFilesForAdmin); // Get all cases for admin
router.get("/allCaseFile/for-client", checkClient, getCaseFileForClient); // Get single case for client
router.get("/singleCaseFile/:id", getSingleCaseFileById);
router.put("/updateCaseFile/:id", checkAdvocate, updateCaseFile); // Update case
router.delete("/deleteCaseFile/:id", checkAdvocate, deleteCaseFile); // Delete case

export default router;
