import { Router } from "express";
import {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
} from "../../controllers/SpecializationController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin, protect } from "../../middleware/authMiddleware.js";

const router = Router();

// These routes handle both specializations and categories (since they're the same)
router.post(
  "/create-specialization",
  protect(["admin", "staff"]),
  upload.single("image"),
  createSpecialization
);
router.get("/get-all-specialization", getAllSpecializations);
router.get("/get-specialization/:id", getSpecializationById);
router.put(
  "/update-specialization/:id",
  protect(["admin", "staff"]),
  upload.single("image"),
  updateSpecialization
);
router.delete("/delete-specialization/:id", checkAdmin, deleteSpecialization);

// Specialization aliases (since specialization = Specialization in your system)
router.post(
  "/create-specialization",
  protect(["admin", "staff"]),
  upload.single("image"),
  createSpecialization
);
router.get("/get-all-categories", getAllSpecializations);
router.get("/get-Specialization/:id", getSpecializationById);
router.put(
  "/update-Specialization/:id",
  protect(["admin", "staff"]),
  upload.single("image"),
  updateSpecialization
);
router.delete("/delete-Specialization/:id", checkAdmin, deleteSpecialization);

export default router;
