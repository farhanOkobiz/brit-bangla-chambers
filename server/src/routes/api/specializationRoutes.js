import { Router } from "express";
import {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
} from "../../controllers/SpecializationController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

// These routes handle both specializations and categories (since they're the same)
router.post(
  "/create-specialization",
  checkAdmin,
  upload.single("image"),
  createSpecialization
);
router.get("/get-all-specialization", getAllSpecializations);
router.get("/get-specialization/:id", getSpecializationById);
router.put(
  "/update-specialization/:id",
  checkAdmin,
  upload.single("image"),
  updateSpecialization
);
router.delete("/delete-specialization/:id", checkAdmin, deleteSpecialization);

// Category aliases (since specialization = category in your system)
router.post(
  "/create-category",
  checkAdmin,
  upload.single("image"),
  createSpecialization
);
router.get("/get-all-categories", getAllSpecializations);
router.get("/get-category/:id", getSpecializationById);
router.put(
  "/update-category/:id",
  checkAdmin,
  upload.single("image"),
  updateSpecialization
);
router.delete("/delete-category/:id", checkAdmin, deleteSpecialization);

export default router;
