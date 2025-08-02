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

const router = Router();

router.post("/create-blog", upload.single("image"), createBlog);
router.get("/get-all-blog", getAllBlogs);
router.get("/get-blog-published", getBlogsPublished);
router.get("/get-single-blog/:id", getBlogById);
router.put("/edit-blog/:id", upload.single("image"), updateBlog);
router.delete("/delete-blog/:id", deleteBlog);

export default router;
