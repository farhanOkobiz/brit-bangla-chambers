import Advocate from "../models/advocateSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Education from "../models/educationSchema.js";
<<<<<<< HEAD
import mongoose from "mongoose";


=======
import testimonialSchema from "../models/testimonialSchema.js";
import caseHistory from "../models/caseHistory.js";
import documentSchema from "../models/documentSchema.js";
import certificationScema from "../models/certificationSchema.js";
>>>>>>> 60b6d7dabf8fe68f992a2cf4c37c23f0119a3ab4

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      console.log("File deleted:", filePath);
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
    console.log("=== CREATE ADVOCATE PROFILE ===");
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
    const profilePhotoUrl = `${req.protocol}://${req.get("host")}/uploads/${uploadedFilename}`;

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
  const session = await mongoose.startSession();
  session.startTransaction();

  let newProfilePhotoFilename = null;

  try {
    const { id } = req.params;
    const isFormData = req.headers["content-type"]?.includes(
      "multipart/form-data"
    );
    let requestData = isFormData ? { ...req.body } : req.body;

    // === Parse if FormData ===
    if (isFormData) {
      const parseJSONField = (field) => {
        if (requestData[field] && typeof requestData[field] === "string") {
          try {
            requestData[field] = JSON.parse(requestData[field]);
          } catch {}
        }
      };
      ["contact", "available_hours", "fee_structure", "education"].forEach(
        parseJSONField
      );

      if (requestData.consultation_available === "true")
        requestData.consultation_available = true;
      if (requestData.consultation_available === "false")
        requestData.consultation_available = false;
      if (requestData.featured === "true") requestData.featured = true;
      if (requestData.featured === "false") requestData.featured = false;
    }

    const advocate = await Advocate.findById(id).session(session);
    if (!advocate) {
      return res.status(404).json({ message: "Advocate profile not found" });
    }

    const user = await User.findById(advocate.user_id).session(session);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // === Update user ===
    if (requestData.full_name) user.full_name = requestData.full_name;
    if (requestData.phone) user.phone = requestData.phone;
    await user.save({ session });

    // === Update advocate fields ===
    Object.assign(advocate, {
      designation: requestData.designation ?? advocate.designation,
      bar_council_enroll_num:
        requestData.bar_council_enroll_num ?? advocate.bar_council_enroll_num,
      experience_years: parseInt(requestData.experience_years) || 0,
      bio: requestData.bio ?? advocate.bio,
      office_address: requestData.office_address ?? advocate.office_address,
      available_hours: requestData.available_hours ?? advocate.available_hours,
      contact: requestData.contact ?? advocate.contact,
      languages: requestData.languages ?? advocate.languages,
      specialization_ids:
        requestData.specialization_ids ?? advocate.specialization_ids,
      certification_ids:
        requestData.certification_ids ?? advocate.certification_ids,
      testimonial_ids: requestData.testimonial_ids ?? advocate.testimonial_ids,
      case_history_ids:
        requestData.case_history_ids ?? advocate.case_history_ids,
      document_ids: requestData.document_ids ?? advocate.document_ids,
      consultation_available:
        requestData.consultation_available ?? advocate.consultation_available,
      fee_structure: requestData.fee_structure ?? advocate.fee_structure,
      stats: requestData.stats ?? advocate.stats,
      status: requestData.status ?? advocate.status,
      featured: requestData.featured ?? advocate.featured,
    });

    // === Handle Education (update or insert) ===
    if (Array.isArray(requestData.education)) {
      const educationIds = [];

      for (const edu of requestData.education) {
        if (edu._id) {
          await Education.findByIdAndUpdate(edu._id, edu, { session });
          educationIds.push(edu._id);
        } else {
          const newEdu = await Education.create(
            [
              {
                ...edu,
                user_id: advocate.user_id,
                user_type: "Advocate",
              },
            ],
            { session }
          );
          educationIds.push(newEdu[0]._id);
        }
      }

      advocate.education_ids = educationIds;
    }

    // === Handle profile photo ===
    if (req.file) {
      newProfilePhotoFilename = req.file.filename;
      const newPath = `${req.protocol}://${req.get("host")}/uploads/${newProfilePhotoFilename}`;

      // Delete old photo if exists
      if (advocate.profile_photo_url) {
        const oldPhotoPath = getUploadPath(
          path.basename(advocate.profile_photo_url)
        );
        if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
      }

      advocate.profile_photo_url = newPath;
    }

    await advocate.save({ session });
    await session.commitTransaction();
    session.endSession();

    const populated = await advocate.populate("user_id", "-password");

    return res.status(200).json({
      message: "Advocate profile updated successfully",
      advocate: populated,
    });
  } catch (error) {
    if (newProfilePhotoFilename) {
      deleteFile(getUploadPath(newProfilePhotoFilename));
    }

    await session.abortTransaction();
    session.endSession();
    console.error("Error updating advocate:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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
