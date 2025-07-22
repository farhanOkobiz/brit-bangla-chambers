import { Router } from "express";
import {
  showAllAdvocates,
  showAdvocateByUserId,
  showAdvocateById,
  createAdvocateProfile,
  updateAdvocateProfile,
  deleteAdvocateProfile
} from "../../controllers/advocateController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin, protect } from "../../middleware/authMiddleware.js";

const router = Router();

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

