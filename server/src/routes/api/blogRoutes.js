import {Router} from 'express';
import { createBlog, deleteBlog, getAllBlogs, getBlogBySlug, updateBlog } from '../../controllers/blogController.js';

const router = Router();

router.post('/create-blog',createBlog);
router.get('/get-all-blogs', getAllBlogs);
router.get("/get-blog-slug/:id", getBlogBySlug);
router.put('/update-blog/:id', updateBlog);
router.delete('/delete-blog/:id', deleteBlog);

export default router;