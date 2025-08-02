import Advocate from "../models/advocateSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Education from "../models/educationSchema.js";
import mongoose from "mongoose";

import testimonialSchema from "../models/testimonialSchema.js";
import caseHistory from "../models/caseHistory.js";
import documentSchema from "../models/documentSchema.js";
import certificationScema from "../models/certificationSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "..", "uploads");

// === Helper Functions ===

// Extract filename from URL
const getFilenameFromUrl = (url) => {
  const parts = url.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
};

// Absolute path to uploaded file
const getUploadPath = (filename) => {
  return path.join(__dirname, "..", "..", "uploads", filename);
};

// Delete file safely
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to delete file:", err);
    return false;
  }
};

// Parse FormData JSON fields
const parseJsonFields = (requestData, fields) => {
  fields.forEach((key) => {
    if (requestData[key] && typeof requestData[key] === "string") {
      try {
        requestData[key] = JSON.parse(requestData[key]);
      } catch (err) {
        console.error(`Error parsing ${key}:`, err);
        requestData[key] = Array.isArray(key) ? [] : {};
      }
    }
  });
};

// Convert boolean strings
const parseBooleans = (requestData, keys) => {
  keys.forEach((key) => {
    if (requestData[key] === "true") requestData[key] = true;
    if (requestData[key] === "false") requestData[key] = false;
  });
};

export const showAdvocate = async (req, res) => {
  try {
    const user_id = req.user._id;
    // Get basic user data (excluding password)
    const user = await User.findById(user_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Advocate not found" });
    }
    // Get advocate profile with all referenced fields populated
    const advocate = await Advocate.findOne({ user_id })
      .populate("user_id", "-password")
      .populate("specialization_ids")
      .populate("education_ids")
      .populate("certification_ids")
      .populate("testimonial_ids")
      .populate("case_history_ids")
      .populate("document_ids");
    if (!advocate) {
      return res.status(404).json({ message: "Advocate profile not found" });
    }
    // Return combined profile
    res.status(200).json({ advocate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all advocates
export const showAllAdvocates = async (req, res) => {
  try {
    const advocates = await Advocate.find().populate("user_id", "-password");
    if (!advocates || advocates.length === 0) {
      return res.status(404).json({ message: "No advocates found" });
    }
    res.status(200).json(advocates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get  advocates by featured
export const showAdvocatesByFeatured = async (req, res) => {
  try {
    const advocates = await Advocate.find({ featured: true }).populate(
      "user_id"
    );
    if (!advocates || advocates.length === 0) {
      return res.status(404).json({ message: "No advocates found" });
    }

    res.status(200).json(advocates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get advocate by user id
export const showAdvocateByUserId = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const advocate = await Advocate.findOne({ user_id }).populate(
      "user_id",
      "-password"
    );
    if (!advocate) {
      return res.status(404).json({ message: "Advocate profile not found" });
    }
    res.status(200).json({ user, advocate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get advocate by advocate id
export const showAdvocateById = async (req, res) => {
  try {
    const advocate_id = req.params.id;
    const advocate = await Advocate.findById(advocate_id)
      .populate("user_id", "-password")
      .populate("specialization_ids")
      .populate("education_ids")
      .populate("certification_ids")
      .populate("testimonial_ids")
      .populate("case_history_ids")
      .populate("document_ids");
    if (!advocate) {
      return res.status(404).json({ message: "Advocate not found" });
    }

    res.status(200).json({ advocate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create advocate profile
export const createAdvocateProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let uploadedFilename = null;

  try {
    const isFormData = req.headers["content-type"]?.includes(
      "multipart/form-data"
    );
    let requestData = isFormData ? { ...req.body } : req.body;

    if (isFormData) {
      parseJsonFields(requestData, [
        "contact",
        "bar_memberships",
        "available_hours",
        "fee_structure",
      ]);
      parseBooleans(requestData, ["consultation_available", "featured"]);
    }

    const {
      full_name,
      email,
      phone,
      password,
      designation,
      bar_council_enroll_num,
      experience_years,
      bio,
      office_address,
      available_hours,
      contact,
      languages,
      specialization_ids,
      education,
      certification_ids,
      testimonial_ids,
      case_history_ids,
      document_ids,
      consultation_available,
      fee_structure,
      stats,
      status,
      featured,
      bar_memberships,
    } = requestData;

    // Handle file
    if (!req.file) {
      return res.status(400).json({ error: "Profile photo is required." });
    }

    uploadedFilename = req.file.filename;
    const profilePhotoUrl = `/uploads/${uploadedFilename}`;

    // Basic validation
    if (!full_name || !email || !phone || !password) {
      deleteFile(getUploadPath(uploadedFilename));
      return res.status(400).json({
        message: "Missing required fields",
        required: ["full_name", "email", "phone", "password"],
      });
    }

    // Check if user exists
    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    }).session(session);
    if (existing) {
      deleteFile(getUploadPath(uploadedFilename));
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let generatedSlug = "";

    generatedSlug =
      full_name && full_name.length > 0
        ? full_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        : `advocate-${Date.now()}`;

    // Create user
    const user = await User.create(
      [
        {
          full_name,
          email,
          phone,
          password: hashedPassword,
          role: "advocate",
          otp_verified: false,
        },
      ],
      { session }
    );

    // Create education entries
    const educationIds = [];
    if (Array.isArray(education)) {
      for (const edu of education) {
        const newEdu = await Education.create(
          [{ ...edu, user_type: "Advocate", user_id: user[0]._id }],
          { session }
        );
        educationIds.push(newEdu[0]._id);
      }
    }

    // Create advocate profile
    const advocate = await Advocate.create(
      [
        {
          user_id: user[0]._id,
          designation: designation || "",
          bar_council_enroll_num: bar_council_enroll_num || "",
          experience_years: experience_years ? parseInt(experience_years) : 0,
          bio: bio || "",
          slug: generatedSlug,
          office_address: office_address || "",
          available_hours: available_hours || {},
          contact: contact || {},
          languages: languages || [],
          specialization_ids: specialization_ids || [],
          education_ids: educationIds,
          certification_ids: certification_ids || [],
          testimonial_ids: testimonial_ids || [],
          case_history_ids: case_history_ids || [],
          document_ids: document_ids || [],
          consultation_available: consultation_available || false,
          fee_structure: fee_structure || { base_fee: 0, show_publicly: false },
          stats: stats || {},
          status: status || "pending",
          featured: featured || false,
          profile_photo_url: profilePhotoUrl,
          bar_memberships: bar_memberships || [],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populated = await advocate[0].populate("user_id", "-password");

    return res.status(201).json({
      message: "Advocate profile created successfully",
      user: user[0],
      advocate: populated,
    });
  } catch (error) {
    console.error("Error creating advocate profile:", error);

    if (uploadedFilename) {
      deleteFile(getUploadPath(uploadedFilename));
    }

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Server error while creating profile",
      error: error.message,
    });
  }
};

// Update advocate profile (with photo upload)
export const updateAdvocateProfile = async (req, res) => {
  let newProfilePhotoPath;
  try {
    // Parse FormData JSON fields if present
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      parseJsonFields(req.body, [
        "available_hours",
        "contact",
        "fee_structure",
        "stats",
        "bar_memberships",
      ]);
      parseBooleans(req.body, ["consultation_available", "featured"]);
    }

    const { id } = req.params;
    const {
      full_name,
      phone,
      designation,
      bar_council_enroll_num,
      experience_years,
      bio,
      office_address,
      available_hours,
      contact,
      languages,
      specialization_ids,
      education_ids,
      certification_ids,
      testimonial_ids,
      case_history_ids,
      document_ids,
      consultation_available,
      fee_structure,
      stats,
      status,
      featured,
      bar_memberships,
      avg_rating,
      total_reviews,
    } = req.body;

    // Handle empty string for booleans
    const safeConsultationAvailable =
      consultation_available === "" ? undefined : consultation_available;
    const safeFeatured = featured === "" ? undefined : featured;

    // For nested fee_structure.show_publicly
    if (fee_structure && typeof fee_structure.show_publicly !== "undefined") {
      fee_structure.show_publicly =
        fee_structure.show_publicly === ""
          ? undefined
          : fee_structure.show_publicly;
    }

    // Find the advocate
    const advocate = await Advocate.findById(id);
    if (!advocate) {
      return res.status(404).json({ message: "Advocate profile not found" });
    }

    // Find the associated user
    const user = await User.findById(advocate.user_id);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // === Update user fields ===
    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    await user.save();

    // === Update advocate fields ===
    if (designation !== undefined) advocate.designation = designation;
    if (bar_council_enroll_num !== undefined)
      advocate.bar_council_enroll_num = bar_council_enroll_num;
    if (experience_years !== undefined)
      advocate.experience_years = experience_years;
    if (bio !== undefined) advocate.bio = bio;
    if (office_address !== undefined) advocate.office_address = office_address;
    if (available_hours !== undefined)
      advocate.available_hours = available_hours;
    if (contact !== undefined) advocate.contact = contact;
    if (languages !== undefined) advocate.languages = languages;
    if (specialization_ids !== undefined)
      advocate.specialization_ids = specialization_ids;

    // Handle education update/creation
    if (Array.isArray(req.body.education)) {
      let updatedEducationIds = [];
      for (const edu of req.body.education) {
        if (edu._id) {
          // Update existing education
          await Education.findByIdAndUpdate(edu._id, edu);
          updatedEducationIds.push(edu._id);
        } else {
          // Create new education
          const newEdu = await Education.create({
            ...edu,
            user_type: "Advocate",
            user_id: advocate.user_id,
          });
          updatedEducationIds.push(newEdu._id);
        }
      }
      advocate.education_ids = updatedEducationIds;
    } else if (education_ids !== undefined) {
      advocate.education_ids = education_ids;
    }

    if (certification_ids !== undefined)
      advocate.certification_ids = certification_ids;
    if (testimonial_ids !== undefined)
      advocate.testimonial_ids = testimonial_ids;
    if (case_history_ids !== undefined)
      advocate.case_history_ids = case_history_ids;
    if (document_ids !== undefined) advocate.document_ids = document_ids;
    if (safeConsultationAvailable !== undefined)
      advocate.consultation_available = safeConsultationAvailable;
    if (fee_structure !== undefined) advocate.fee_structure = fee_structure;
    if (stats !== undefined) advocate.stats = stats;
    if (status !== undefined) advocate.status = status;
    if (safeFeatured !== undefined) advocate.featured = safeFeatured;
    if (bar_memberships !== undefined)
      advocate.bar_memberships = bar_memberships;
    if (avg_rating !== undefined) advocate.avg_rating = avg_rating;
    if (total_reviews !== undefined) advocate.total_reviews = total_reviews;

    // === Handle new profile photo ===
    if (req.file) {
      newProfilePhotoPath = path.join(uploadPath, req.file.filename);

      // Delete old profile photo if exists
      if (advocate.profile_photo_url) {
        const oldPhotoPath = path.join(
          uploadPath,
          path.basename(advocate.profile_photo_url)
        );
        try {
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        } catch (deleteError) {
          console.warn(
            "Could not delete old profile photo:",
            deleteError.message
          );
        }
      }
      advocate.profile_photo_url = `/uploads/${req.file.filename}`;
    }

    await advocate.save();
    const populatedAdvocate = await advocate.populate("user_id", "-password");

    res.status(200).json({
      message: "Advocate profile updated successfully",
      advocate: populatedAdvocate,
    });
  } catch (error) {
    // Cleanup uploaded file if error occurred
    if (newProfilePhotoPath) {
      try {
        if (fs.existsSync(newProfilePhotoPath)) {
          fs.unlinkSync(newProfilePhotoPath);
        }
      } catch (cleanupError) {
        console.warn("Could not cleanup uploaded file:", cleanupError.message);
      }
    }

    console.error("Advocate profile update error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete advocate profile
export const deleteAdvocateProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const advocate = await Advocate.findById(id).session(session);
    if (!advocate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Advocate profile not found" });
    }

    // === Delete profile photo ===
    if (advocate.profile_photo_url) {
      const photoPath = getUploadPath(
        path.basename(advocate.profile_photo_url)
      );
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // === Delete related Education ===
    if (advocate.education_ids && advocate.education_ids.length > 0) {
      await Education.deleteMany({
        _id: { $in: advocate.education_ids },
      }).session(session);
    }

    // === Delete advocate profile ===
    await Advocate.findByIdAndDelete(id).session(session);

    // === Delete associated user ===
    const deletedUser = await User.findByIdAndDelete(advocate.user_id).session(
      session
    );
    if (!deletedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Associated user not found" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message:
        "Advocate profile, user, photo, and related education deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete advocate error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
