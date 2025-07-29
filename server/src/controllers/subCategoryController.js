import validator from "validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Subcategory from "../models/subCategorySchema.js";

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

// Create a new Subcategory
export const createSubCategory = async (req, res) => {
  let newImageFilename = null;

  try {
    const { name, description, link, categoryId } = req.body;

    // Validate required fields
    if (!name || !categoryId) {
      return res.status(400).json({
        error: "Name and categoryId are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Store filename for cleanup
    newImageFilename = req.file.filename;
    const image = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;

    // Validate URL format
    if (link && !validator.isURL(link)) {
      deleteFile(getUploadPath(newImageFilename));
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    // Check for duplicate subcategory name in the same category
    const existing = await Subcategory.findOne({ name, categoryId });
    if (existing) {
      deleteFile(getUploadPath(newImageFilename));
      return res.status(400).json({
        error: "Subcategory name already exists in this category",
      });
    }

    const newSubcategory = new Subcategory({
      name,
      description,
      image,
      link,
      categoryId,
    });

    await newSubcategory.save();

    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory: newSubcategory,
    });
  } catch (error) {
    if (newImageFilename) {
      deleteFile(getUploadPath(newImageFilename));
    }
    console.error("Create Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all subcategories
export const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .sort({ createdAt: -1 })
      .populate("categoryId", "name");

    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Get Subcategories Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get subcategories by category
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const subcategories = await Subcategory.find({ categoryId })
      .sort({ createdAt: -1 })
      .populate("categoryId", "name");

    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Get Subcategories Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single Subcategory by ID
export const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate(
      "categoryId",
      "name image"
    );

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    console.error("Get Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a Subcategory
export const updateSubCategory = async (req, res) => {
  let newImageFilename = null;
  let oldImageFilename = null;

  try {
    const { id } = req.params;
    const { name, description, link, categoryId } = req.body;

    // Validate categoryId if provided
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Validate URL format
    if (link && !validator.isURL(link)) {
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    const existingSubcategory = await Subcategory.findById(id);
    if (!existingSubcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Check for duplicate name in the same category
    if (name) {
      const targetCategoryId = categoryId || existingSubcategory.categoryId;
      const existing = await Subcategory.findOne({
        name,
        categoryId: targetCategoryId,
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(400).json({
          error: "Subcategory name already exists in this category",
        });
      }
    }

    // Store old image filename for cleanup
    if (existingSubcategory.image) {
      oldImageFilename = getFilenameFromUrl(existingSubcategory.image);
    }

    // Prepare update data
    const updateData = {
      name: name || existingSubcategory.name,
      description: description || existingSubcategory.description,
      link: link || existingSubcategory.link,
      categoryId: categoryId || existingSubcategory.categoryId,
      image: existingSubcategory.image,
    };

    // Handle new image upload
    if (req.file) {
      newImageFilename = req.file.filename;
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("categoryId", "name");

    // Delete old image after successful update (only if new image was uploaded)
    if (req.file && oldImageFilename) {
      deleteFile(getUploadPath(oldImageFilename));
    }

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory: updatedSubcategory,
    });
  } catch (error) {
    if (newImageFilename) {
      deleteFile(getUploadPath(newImageFilename));
    }
    console.error("Update Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a Subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Delete associated image
    if (subcategory.image) {
      const filename = getFilenameFromUrl(subcategory.image);
      if (filename) {
        deleteFile(getUploadPath(filename));
      }
    }

    await Subcategory.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Delete Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
