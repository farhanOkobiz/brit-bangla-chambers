import Blog from "../models/blogSchema.js";


// Create a new blog
export const createBlog = async (req, res, next) => {
    console.log("hit api");
  try {
    const {
      author_id,
      author_model,
      title,
      slug,
      content,
      tags,
      published_at,
      status,
    } = req.body;

    const blog = await Blog.create({
      author_id,
      author_model,
      title,
      slug,
      content,
      tags,
      published_at,
      status,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// Get all blogs (with filters, pagination, search)
export const getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;

    const query = {
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

// Get single blog by slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });

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

    const updated = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// Delete a blog
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
};
