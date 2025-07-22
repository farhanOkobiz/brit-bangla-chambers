import { Router } from "express";
import {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
} from "../../controllers/SpecializationController.js";
import upload from "../../middleware/multerMiddleware.js";

const router = Router();

router.post("/create-category", upload.single("image"), createSpecialization);
router.get("/get-all-categories", getAllSpecializations);
router.get("/get-category/:id", getSpecializationById);
router.put("/update-category/:id", upload.single("image"), updateSpecialization);
router.delete("/delete-category/:id", deleteSpecialization);

export default router;
