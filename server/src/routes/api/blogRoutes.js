import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../../controllers/blogController.js";

const router = Router();

router.post("/create-blog", createBlog);
router.get("/get-all-blog", getAllBlogs);
router.get("/get-single-blog/:id", getBlogById);
router.put("/edit-blog/:id", updateBlog);
router.delete("/delete-blog/:id", deleteBlog);

export default router;
