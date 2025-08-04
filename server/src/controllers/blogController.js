import Blog from "../models/blogSchema.js";
import { deleteUploadedFile } from "../utils/deleteUploadedFile.js";

// Create a new blog
export const createBlog = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Form data is missing" });
    }

    const { title, content, tags, status, author } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const blog = await Blog.create({
      image,
      title,
      content,
      tags: parsedTags,
      published_at: new Date(),
      status,
      author,
      author_id: req.user.id,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error("Create blog error:", err);
    next(err);
  }
};

// Get all blogs (with filters, pagination, search)
export const getAllBlogs = async (req, res, next) => {
  const id = req?.user?.id;

  try {
    const { page = 1, limit = 10, search = "", status } = req.query;

    const query = {
      ...(req.user.role === "advocate" && { author_id: id }),
      ...(status && { status }),
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $in: [search] } },
        ],
      }),
    };

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.json({ success: true, data: blogs, total });
  } catch (err) {
    next(err);
  }
};
// Get published blogs (with filters, pagination, search)
export const getBlogsPublished = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      status: "published",
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $in: [search] } },
        ],
      }),
    };

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.json({ success: true, data: blogs, total });
  } catch (err) {
    next(err);
  }
};

// Get single blog by slug
export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// Update a blog
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, status, author_model, author } = req.body;

    let tags = [];
    try {
      tags = JSON.parse(req.body.tags);
    } catch {
      tags = [];
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    const updatePayload = {
      title,
      content,
      tags,
      status,
      author_model,
      author,
    };

    // If a new image was uploaded
    if (req.file) {
      updatePayload.image = `/uploads/${req.file.filename}`;

      // Delete old image only if new image is uploaded
      if (blog.image) {
        const filename = blog.image.startsWith("/uploads/")
          ? blog.image.slice("/uploads/".length)
          : blog.image;

        deleteUploadedFile(filename);
      }
    }

    const updated = await Blog.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// Delete a blog
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    if (blog.image) {
      const filename = blog.image.startsWith("/uploads/")
        ? blog.image.slice("/uploads/".length)
        : blog.image;

      deleteUploadedFile(filename);
    }

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
};
