import { Router } from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../../controllers/subCategoryController.js";
import upload from "../../middleware/multerMiddleware.js";

const router = Router();

router.post("/create-sub-category", upload.single("image"), createSubCategory);
router.get("/get-all-sub-categories", getAllSubCategories);
router.get("/get-sub-category/:id", getSubCategoryById);
router.put(
  "/update-sub-category/:id",
  upload.single("image"),
  updateSubCategory
);
router.delete("/delete-sub-category/:id", deleteSubCategory);

export default router;
