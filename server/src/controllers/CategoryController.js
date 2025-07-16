import validator from "validator";
import fs from "fs";
import path from "path";
import Category from "../models/categorySchema.js";

// Helper function to extract filename from URL
const getFilenameFromUrl = (url) => {
  const parts = url.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
};

// Create a new category
export const createCategory = async (req, res) => {
  let newImageFilename = null;

  try {
    const { name, description, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Store filename for cleanup
    newImageFilename = req.file.filename;

    // Construct full image URL
    const image = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;

    // Validate URL format if link exists
    if (link && !validator.isURL(link)) {
      // Cleanup uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    // Check for duplicate category
    const existing = await Category.findOne({ name });
    if (existing) {
      // Cleanup uploaded file if duplicate exists
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name, description, image, link });
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    // Cleanup uploaded file on error
    if (newImageFilename) {
      const filePath = path.join("uploads", newImageFilename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    console.error("Create Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Get Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  let newImageFilename = null;
  let oldImagePath = null;

  try {
    const { id } = req.params;
    const { name, description, link } = req.body;

    // Validate link format if provided
    if (link && !validator.isURL(link)) {
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    // Check for duplicate name (excluding current category)
    if (name) {
      const existing = await Category.findOne({ name, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ error: "Category name already in use" });
      }
    }

    // Get existing category
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Store old image path for cleanup
    if (existingCategory.image) {
      const filename = getFilenameFromUrl(existingCategory.image);
      if (filename) oldImagePath = path.join("uploads", filename);
    }

    // Prepare update data
    const updateData = {
      name: name || existingCategory.name,
      description: description || existingCategory.description,
      link: link || existingCategory.link,
      image: existingCategory.image,
    };

    // Handle new image upload
    if (req.file) {
      newImageFilename = req.file.filename;
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // Cleanup old image after successful update
    if (req.file && oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Old image deletion error:", err);
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    // Cleanup new uploaded file on error
    if (newImageFilename) {
      const filePath = path.join("uploads", newImageFilename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    console.error("Update Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    console.log("hit deleteCategory");
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    console.log("Category found:", category.image);

    // Delete associated image file
    if (category.image) {
      const filename = getFilenameFromUrl(category.image);
      if (filename) {
        const filePath = path.join("uploads", filename);
        console
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Image deletion error:", err);
          });
        }
      }
    }

    // Delete the category document
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
