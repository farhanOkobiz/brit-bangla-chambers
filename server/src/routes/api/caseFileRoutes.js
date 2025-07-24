import express from "express";
import {
  createCaseFile,
  deleteCaseFile,
  getAllCaseFiles,
  getCaseFileById,
  updateCaseFile,
} from "../../controllers/caseFileController.js";

const router = express.Router();

router.post("/", createCaseFile); // Create case
router.get("/", getAllCaseFiles); // Get all cases
router.get("/:id", getCaseFileById); // Get single case
router.put("/:id", updateCaseFile); // Update case
router.delete("/:id", deleteCaseFile); // Delete case

export default router;
