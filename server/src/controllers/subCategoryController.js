import validator from "validator";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Subcategory from "../models/subCategorySchema.js";

// Helper function to extract filename from URL
const getFilenameFromUrl = (url) => {
  const parts = url.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
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
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    // Check for duplicate subcategory name in the same category
    const existing = await Subcategory.findOne({ name, categoryId });
    if (existing) {
      fs.unlinkSync(req.file.path);
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
      const filePath = path.join("uploads", newImageFilename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
  let oldImagePath = null;

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

    // Store old image path
    if (existingSubcategory.image) {
      const filename = getFilenameFromUrl(existingSubcategory.image);
      if (filename) oldImagePath = path.join("uploads", filename);
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

    // Delete old image after successful update
    if (req.file && oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Old image deletion error:", err);
      });
    }

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory: updatedSubcategory,
    });
  } catch (error) {
    if (newImageFilename) {
      const filePath = path.join("uploads", newImageFilename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
        const filePath = path.join("uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Image deletion error:", err);
          });
        }
      }
    }

    await Subcategory.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Delete Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
