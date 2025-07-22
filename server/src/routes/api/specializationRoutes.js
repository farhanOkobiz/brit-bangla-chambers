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

router.post("/create-specialization", upload.single("image"), createSpecialization);
router.get("/get-all-specialization", getAllSpecializations);
router.get("/get-specialization/:id", getSpecializationById);
router.put("/update-specialization/:id", upload.single("image"), updateSpecialization);
router.delete("/delete-specialization/:id", deleteSpecialization);

export default router;
