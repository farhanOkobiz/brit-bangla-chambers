import validator from "validator";
import fs from "fs";
import path from "path";
import Subcategory from "../models/subCategorySchema.js";

// Helper function to extract filename from URL
const getFilenameFromUrl = (url) => {
  const parts = url.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
};

// Create a new Subcategory
export const createSubcategory = async (req, res) => {
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

    // Check for duplicate Subcategory
    const existing = await Subcategory.findOne({ name });
    if (existing) {
      // Cleanup uploaded file if duplicate exists
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Subcategory already exists" });
    }

    const newSubcategory = new Subcategory({ name, description, image, link });
    await newSubcategory.save();

    res.status(201).json({
      message: "Subcategory created successfully",
      Subcategory: newSubcategory,
    });
  } catch (error) {
    // Cleanup uploaded file on error
    if (newImageFilename) {
      const filePath = path.join("uploads", newImageFilename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    console.error("Create Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Subcategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single Subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const Subcategory = await Subcategory.findById(req.params.id);
    if (!Subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }
    res.status(200).json(Subcategory);
  } catch (error) {
    console.error("Get Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a Subcategory
export const updateSubcategory = async (req, res) => {
  let newImageFilename = null;
  let oldImagePath = null;

  try {
    const { id } = req.params;
    const { name, description, link } = req.body;

    // Validate link format if provided
    if (link && !validator.isURL(link)) {
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    // Check for duplicate name (excluding current Subcategory)
    if (name) {
      const existing = await Subcategory.findOne({ name, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ error: "Subcategory name already in use" });
      }
    }

    // Get existing Subcategory
    const existingSubcategory = await Subcategory.findById(id);
    if (!existingSubcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Store old image path for cleanup
    if (existingSubcategory.image) {
      const filename = getFilenameFromUrl(existingSubcategory.image);
      if (filename) oldImagePath = path.join("uploads", filename);
    }

    // Prepare update data
    const updateData = {
      name: name || existingSubcategory.name,
      description: description || existingSubcategory.description,
      link: link || existingSubcategory.link,
      image: existingSubcategory.image,
    };

    // Handle new image upload
    if (req.file) {
      newImageFilename = req.file.filename;
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;
    }

    // Update the Subcategory
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // Cleanup old image after successful update
    if (req.file && oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Old image deletion error:", err);
      });
    }

    res.status(200).json({
      message: "Subcategory updated successfully",
      Subcategory: updatedSubcategory,
    });
  } catch (error) {
    // Cleanup new uploaded file on error
    if (newImageFilename) {
      const filePath = path.join("uploads", newImageFilename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    console.error("Update Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a Subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const Subcategory = await Subcategory.findById(req.params.id);
    if (!Subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Delete associated image file
    if (Subcategory.image) {
      const filename = getFilenameFromUrl(Subcategory.image);
      if (filename) {
        const filePath = path.join("uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Image deletion error:", err);
          });
        }
      }
    }

    // Delete the Subcategory document
    await Subcategory.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Delete Subcategory Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
