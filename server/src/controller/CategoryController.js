import validator from "validator"; 
import Category from "../models/Category.js"; 

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Construct full image URL
    const image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

   if (link && !validator.isURL(link)) {
     return res.status(400).json({ error: "Invalid URL format for link" });
   }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name, description, image, link });
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Get Category Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, link } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, link },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category: updated,
    });
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};