import { Router } from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../../controllers/subCategoryController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin, protect } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/create-sub-category",protect(["admin", "staff"]) , upload.single("image"), createSubCategory);
router.get("/get-all-sub-categories",protect(["admin", "staff"]) , getAllSubCategories);
router.get("/get-sub-category/:id",protect(["admin", "staff"])  , getSubCategoryById);
router.put(
  "/update-sub-category/:id", protect(["admin", "staff"]) ,
  upload.single("image"),
  updateSubCategory
);
router.delete("/delete-sub-category/:id",checkAdmin, deleteSubCategory);

export default router;
