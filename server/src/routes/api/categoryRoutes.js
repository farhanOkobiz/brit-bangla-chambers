import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/CategoryController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/create-category", checkAdmin, upload.single("image"), createCategory);
router.get("/get-all-categories",checkAdmin, getAllCategories);
router.get("/get-category/:id",checkAdmin, getCategoryById);
router.put("/update-category/:id",checkAdmin, upload.single("image"), updateCategory);
router.delete("/delete-category/:id",checkAdmin, deleteCategory);

export default router;
