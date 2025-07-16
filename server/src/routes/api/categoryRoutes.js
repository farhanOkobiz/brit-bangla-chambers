import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/CategoryController.js";
import upload from "../../middleware/multerMiddleware.js";

const router = Router();

router.post("/create-category", upload.single("image"), createCategory);
router.get("/get-all-categories", getAllCategories);
router.get("/get-category/:id", getCategoryById);
router.put("/update-category/:id", upload.single("image"), updateCategory);
router.delete("/delete-category/:id", deleteCategory);

export default router;
