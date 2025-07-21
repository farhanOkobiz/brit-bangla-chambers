import validator from "validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Category from "../models/categorySchema.js";

// Get current directory for proper path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to extract filename from URL
const getFilenameFromUrl = (url) => {
  const parts = url.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
};

// Helper function to get absolute upload path
const getUploadPath = (filename) => {
  return path.join(__dirname, "..", "..", "uploads", filename);
};

// Helper function to safely delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully:", filePath);
      return true;
    } else {
      console.warn("File not found:", filePath);
      return false;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  console.log("hit createCategory");
  let newImageFilename = null;

  try {
    const { name, details, link } = req.body;

    console.log("Received data:", { name, details, link });

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
      deleteFile(getUploadPath(newImageFilename));
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    // Check for duplicate category
    const existing = await Category.findOne({ name });
    if (existing) {
      // Cleanup uploaded file if duplicate exists
      deleteFile(getUploadPath(newImageFilename));
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name, details, image, link });
    await newCategory.save();
    console.log("Category created successfully:", newCategory);

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    // Cleanup uploaded file on error
    if (newImageFilename) {
      deleteFile(getUploadPath(newImageFilename));
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
  let oldImageFilename = null;

  try {
    const { id } = req.params;
    const { name, details, link } = req.body;

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

    // Store old image filename for cleanup
    if (existingCategory.image) {
      oldImageFilename = getFilenameFromUrl(existingCategory.image);
    }

    // Prepare update data
    const updateData = {
      name: name || existingCategory.name,
      details: details || existingCategory.details,
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

    // Cleanup old image after successful update (only if new image was uploaded)
    if (req.file && oldImageFilename) {
      deleteFile(getUploadPath(oldImageFilename));
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    // Cleanup new uploaded file on error
    if (newImageFilename) {
      deleteFile(getUploadPath(newImageFilename));
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
        deleteFile(getUploadPath(filename));
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
