import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsPublished,
  updateBlog,
} from "../../controllers/blogController.js";
import upload from "../../middleware/multerMiddleware.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/create-blog",
  upload.single("image"),
  protect(["admin", "advocate"]),
  createBlog
);
router.get("/get-all-blog", protect(["admin", "advocate", "staff"]), getAllBlogs);
router.get("/get-blog-published", getBlogsPublished);
router.get("/get-single-blog/:id", getBlogById);
router.put("/edit-blog/:id", upload.single("image"), updateBlog);
router.delete("/delete-blog/:id", deleteBlog);

export default router;
