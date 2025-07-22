import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Service from "../models/serviceSchema.js";

// Get current directory for proper path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads directory (project root level)
const uploadDir = path.join(__dirname, "..", "..", "uploads");

// Make sure uploads folder exists
const ensureUploadDirExists = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

// Helper function to extract filename from URL
const getFilenameFromUrl = (imageURL) => {
  if (!imageURL) return null;
  const parts = imageURL.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
};

// Helper function to get absolute upload path
const getUploadPath = (filename) => {
  return path.join(uploadDir, filename);
};

// Delete image from uploads folder
const deleteImage = (imageURL) => {
  try {
    const filename = getFilenameFromUrl(imageURL);
    if (!filename) return false;

    const imagePath = getUploadPath(filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Deleted image:", imagePath);
      return true;
    } else {
      console.warn("Image file not found:", imagePath);
      return false;
    }
  } catch (err) {
    console.error("Image deletion error:", err.message);
    return false;
  }
};

// Create Service
export const createService = async (req, res) => {
  try {
    ensureUploadDirExists();

    // Log the authenticated user for debugging
    console.log("Authenticated user:", req.user);

    const { category, subcategory, title, description, status } = req.body;

    // Validate required fields
    if (!category || !subcategory || !title || !description) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["category", "subcategory", "title", "description"],
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const imagePath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    const service = await Service.create({
      category,
      subcategory,
      title,
      description,
      created_by: req.user._id, // Get from authenticated user
      serviceImage: imagePath,
      status: status || "active", // Default to active if not provided
    });

    console.log("Service created successfully:", service);

    res.status(201).json({
      message: "Service created successfully",
      data: service,
    });
  } catch (err) {
    console.error("Service creation error:", err);

    // Cleanup uploaded file on error
    if (req.file) {
      deleteImage(
        `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      );
    }

    res.status(500).json({
      message: "Create failed",
      error: err.message,
    });
  }
};

// Get All Services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("created_by", "full_name email role")
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// Get Service By ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("created_by", "full_name email role")
      .populate("category", "name")
      .populate("subcategory", "name");
    if (!service) return res.status(404).json({ message: "Not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// Update Service
export const updateService = async (req, res) => {
  let newImageFilename = null;

  try {
    ensureUploadDirExists();
    const { category, subcategory, title, description, status } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Not found" });

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Store old image for potential cleanup
    const oldImageURL = service.serviceImage;

    // Handle new image upload
    if (req.file) {
      newImageFilename = req.file.filename;
      service.serviceImage = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;
    }

    // Update other fields
    service.category = category || service.category;
    service.subcategory = subcategory || service.subcategory;
    service.title = title || service.title;
    service.description = description || service.description;
    service.status = status || service.status;

    const updated = await service.save();

    // Delete old image after successful update (only if new image was uploaded)
    if (req.file && oldImageURL) {
      deleteImage(oldImageURL);
    }

    res.json({ message: "Service updated successfully", data: updated });
  } catch (err) {
    // Cleanup new uploaded file on error
    if (newImageFilename) {
      const newImageURL = `${req.protocol}://${req.get("host")}/uploads/${newImageFilename}`;
      deleteImage(newImageURL);
    }
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Not found" });

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Delete associated image
    if (service.serviceImage) {
      deleteImage(service.serviceImage);
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
