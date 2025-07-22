import { Router } from "express";
import {
  showAllAdvocates,
  showAdvocateByUserId,
  showAdvocateById,
  createAdvocateProfile,
  updateAdvocateProfile,
  deleteAdvocateProfile,
  showAdvocate,
} from "../../controllers/advocateController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin, checkAdvocate, protect } from "../../middleware/authMiddleware.js";

const router = Router();
//Get individual advocate profile
router.get("/profile", checkAdvocate, showAdvocate);
// Get all advocates
router.get("/all", checkAdmin, showAllAdvocates);

// Get advocate by user id
router.get("/profile/:id", checkAdmin, showAdvocateByUserId);

// Get advocate by advocate id
router.get("/profile/advocate/:id", checkAdmin, showAdvocateById);

// Create advocate profile
router.post("/create", checkAdmin, createAdvocateProfile);

// Update advocate profile (with photo upload)
router.put("/update/:id", protect(["admin", "advocate"]), upload.single("profilePhoto"), updateAdvocateProfile);

// Delete advocate profile
router.delete("/profile/:id", checkAdmin, deleteAdvocateProfile);

export default router;

