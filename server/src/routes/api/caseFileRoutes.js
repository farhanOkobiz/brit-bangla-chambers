import express from "express";
import {
  createCaseFile,
  deleteCaseFile,
  getAllCaseFiles,
  getSingleCaseFile,
  updateCaseFile,
} from "../../controllers/caseFileController.js";
import { checkAdvocate, checkClient } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCaseFile", checkAdvocate, createCaseFile); // Create case
router.get("/allCaseFile", getAllCaseFiles); // Get all cases
router.get("/singleCaseFile", checkClient, getSingleCaseFile); // Get single case
router.put("/updateCaseFile/:id", updateCaseFile); // Update case
router.delete("deleteCaseFile/:id", deleteCaseFile); // Delete case

export default router;
