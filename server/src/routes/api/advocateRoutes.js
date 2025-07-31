import { Router } from "express";
import {
  showAllAdvocates,
  showAdvocateByUserId,
  showAdvocateById,
  createAdvocateProfile,
  updateAdvocateProfile,
  deleteAdvocateProfile,
  showAdvocate,
  showAdvocatesByFeatured,
} from "../../controllers/advocateController.js";
import upload from "../../middleware/multerMiddleware.js";
import {
  checkAdmin,
  checkAdvocate,
  protect,
} from "../../middleware/authMiddleware.js";
import { updateOrCreateCertifications } from "../../controllers/certificationController.js";

const router = Router();
//Get individual advocate profile
router.get("/profile", checkAdvocate, showAdvocate);

// Get all advocates
router.get("/all", checkAdmin, showAllAdvocates);

// Get advocates by featured
router.get(
  "/advocateByFeatured",
  showAdvocatesByFeatured
);

// Get advocate by user id
router.get("/profile/:id", checkAdmin, showAdvocateByUserId);

// Get advocate by advocate id
router.get("/profile/advocate/:id", showAdvocateById);

// Create advocate profile (with photo upload support)
router.post(
  "/create",
  checkAdmin,
  upload.single("profilePhoto"),
  createAdvocateProfile
);

// Update advocate profile (with photo upload)
router.put(
  "/update/:id",
  protect(["admin", "advocate"]),
  upload.single("profilePhoto"),
  updateAdvocateProfile
);

// Delete advocate profile
router.delete("/profile/:id", checkAdmin, deleteAdvocateProfile);

// Add certification to advocate
router.post("/certification/:advocateId", updateOrCreateCertifications);

export default router;
