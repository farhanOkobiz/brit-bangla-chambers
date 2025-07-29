import validator from "validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Specialization from "../models/specializationSchema.js";

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

// Create a new Specialization
export const createSpecialization = async (req, res) => {
  console.log("hit createSpecialization");
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

    // Check for duplicate Specialization
    const existing = await Specialization.findOne({ name });
    if (existing) {
      // Cleanup uploaded file if duplicate exists
      deleteFile(getUploadPath(newImageFilename));
      return res.status(400).json({ error: "Specialization already exists" });
    }

    const newSpecialization = new Specialization({
      name,
      details,
      image,
      link,
    });
    await newSpecialization.save();
    console.log("Specialization created successfully:", newSpecialization);

    res.status(201).json({
      message: "Specialization created successfully",
      Specialization: newSpecialization,
    });
  } catch (error) {
    // Cleanup uploaded file on error
    if (newImageFilename) {
      deleteFile(getUploadPath(newImageFilename));
    }

    console.error("Create Specialization Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all Specializations
export const getAllSpecializations = async (req, res) => {
  try {
    const Specializations = await Specialization.find().sort({ createdAt: -1 });
    res.status(200).json(Specializations);
  } catch (error) {
    console.error("Get Specializations Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single Specialization by ID
export const getSpecializationById = async (req, res) => {
  try {
    const Specialization = await Specialization.findById(req.params.id);
    if (!Specialization) {
      return res.status(404).json({ error: "Specialization not found" });
    }
    res.status(200).json(Specialization);
  } catch (error) {
    console.error("Get Specialization Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a Specialization
export const updateSpecialization = async (req, res) => {
  let newImageFilename = null;
  let oldImageFilename = null;

  try {
    const { id } = req.params;
    const { name, details, link } = req.body;

    // Validate link format if provided
    if (link && !validator.isURL(link)) {
      return res.status(400).json({ error: "Invalid URL format for link" });
    }

    // Check for duplicate name (excluding current Specialization)
    if (name) {
      const existing = await Specialization.findOne({ name, _id: { $ne: id } });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Specialization name already in use" });
      }
    }

    // Get existing Specialization
    const existingSpecialization = await Specialization.findById(id);
    if (!existingSpecialization) {
      return res.status(404).json({ error: "Specialization not found" });
    }

    // Store old image filename for cleanup
    if (existingSpecialization.image) {
      oldImageFilename = getFilenameFromUrl(existingSpecialization.image);
    }

    // Prepare update data
    const updateData = {
      name: name || existingSpecialization.name,
      details: details || existingSpecialization.details,
      link: link || existingSpecialization.link,
      image: existingSpecialization.image,
    };

    // Handle new image upload
    if (req.file) {
      newImageFilename = req.file.filename;
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;
    }

    // Update the Specialization
    const updatedSpecialization = await Specialization.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    // Cleanup old image after successful update (only if new image was uploaded)
    if (req.file && oldImageFilename) {
      deleteFile(getUploadPath(oldImageFilename));
    }

    res.status(200).json({
      message: "Specialization updated successfully",
      Specialization: updatedSpecialization,
    });
  } catch (error) {
    // Cleanup new uploaded file on error
    if (newImageFilename) {
      deleteFile(getUploadPath(newImageFilename));
    }

    console.error("Update Specialization Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a Specialization
export const deleteSpecialization = async (req, res) => {
  try {
    console.log("hit deleteSpecialization");
    const specializationDoc = await Specialization.findById(req.params.id); // <-- fixed
    if (!specializationDoc) {
      return res.status(404).json({ error: "Specialization not found" });
    }
    console.log("Specialization found:", specializationDoc.image);

    // Delete associated image file
    if (specializationDoc.image) {
      const filename = getFilenameFromUrl(specializationDoc.image);
      if (filename) {
        deleteFile(getUploadPath(filename));
      }
    }

    // Delete the Specialization document
    await Specialization.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Specialization deleted successfully" });
  } catch (error) {
    console.error("Delete Specialization Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
