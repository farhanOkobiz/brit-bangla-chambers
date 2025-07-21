import { Router } from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../../controllers/subCategoryController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/create-sub-category",checkAdmin, upload.single("image"), createSubCategory);
router.get("/get-all-sub-categories",checkAdmin, getAllSubCategories);
router.get("/get-sub-category/:id",checkAdmin, getSubCategoryById);
router.put(
  "/update-sub-category/:id",checkAdmin,
  upload.single("image"),
  updateSubCategory
);
router.delete("/delete-sub-category/:id",checkAdmin, deleteSubCategory);

export default router;
