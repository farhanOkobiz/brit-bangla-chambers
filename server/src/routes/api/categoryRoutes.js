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

router.post("/create-specialization", checkAdmin, upload.single("image"), createSpecialization);
router.get("/get-all-specialization",checkAdmin, getAllSpecializations);
router.get("/get-specialization/:id",checkAdmin, getSpecializationById);
router.put("/update-specialization/:id",checkAdmin, upload.single("image"), updateSpecialization);
router.delete("/delete-specialization/:id",checkAdmin, deleteSpecialization);

export default router;
