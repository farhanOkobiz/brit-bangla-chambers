import express from "express";
import {
  createCaseFile,
  deleteCaseFile,
  getAllCaseFiles,
  getSingleCaseFile,
  getSingleCaseFileById,
  updateCaseFile,
} from "../../controllers/caseFileController.js";
import {
  checkAdvocate,
  checkClient,
  protect,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCaseFile", protect(["advocate", "client"]), createCaseFile); // Create case
router.get("/allCaseFile", checkAdvocate, getAllCaseFiles); // Get all cases
router.get("/singleCaseFile", checkClient, getSingleCaseFile); // Get single case
router.get("/singleCaseFile/:id", getSingleCaseFileById); // Get single case
router.put("/updateCaseFile/:id", updateCaseFile); // Update case
router.delete("deleteCaseFile/:id", deleteCaseFile); // Delete case

export default router;
