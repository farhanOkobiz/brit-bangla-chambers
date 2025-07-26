import Advocate from "../models/advocateSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Education from "../models/educationSchema.js";
import testimonialSchema from "../models/testimonialSchema.js";
import caseHistory from "../models/caseHistory.js";
import documentSchema from "../models/documentSchema.js";
import certificationScema from "../models/certificationSchema.js";

// ESM-compatible __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "..", "uploads");

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
  try {
    console.log("=== CREATE ADVOCATE DEBUG ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("Content-Type:", req.headers["content-type"]);

    // Handle both JSON and FormData requests
    let requestData = {};

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      // FormData request - data is in req.body
      requestData = { ...req.body };

      // Parse JSON strings back to objects
      if (requestData.contact && typeof requestData.contact === "string") {
        try {
          requestData.contact = JSON.parse(requestData.contact);
        } catch (e) {
          console.error("Error parsing contact JSON:", e);
        }
      }
      if (
        requestData.bar_memberships &&
        typeof requestData.bar_memberships === "string"
      ) {
        try {
          requestData.bar_memberships = JSON.parse(requestData.bar_memberships);
        } catch (e) {
          console.error("Error parsing bar_memberships:", e);
          requestData.bar_memberships = [];
        }
      }

      if (
        requestData.available_hours &&
        typeof requestData.available_hours === "string"
      ) {
        try {
          requestData.available_hours = JSON.parse(requestData.available_hours);
        } catch (e) {
          console.error("Error parsing available_hours JSON:", e);
        }
      }

      if (
        requestData.fee_structure &&
        typeof requestData.fee_structure === "string"
      ) {
        try {
          requestData.fee_structure = JSON.parse(requestData.fee_structure);
        } catch (e) {
          console.error("Error parsing fee_structure JSON:", e);
        }
      }

      // Convert string booleans to actual booleans
      
      if (requestData.consultation_available === "true")
        requestData.consultation_available = true;
      if (requestData.consultation_available === "false")
        requestData.consultation_available = false;
      if (requestData.featured === "true") requestData.featured = true;
      if (requestData.featured === "false") requestData.featured = false;

    } else {
      // JSON request
      requestData = req.body;
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
      slug,
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

    console.log("Parsed data:", {
      full_name,
      email,
      phone,
      designation,
      status,
      consultation_available,
      featured,
    });

    // Validate required fields
    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["full_name", "email", "phone", "password"],
        received: {
          full_name,
          email,
          phone,
          password: password ? "***" : undefined,
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-generate slug if not provided
    let generatedSlug = slug;
    if (!generatedSlug && full_name) {
      generatedSlug = full_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Create new user
    const user = await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role: "advocate",
    });

    // Create education records and collect their _id
    const educationIds = [];
    if (Array.isArray(education)) {
      for (const edu of education) {
        const newEdu = await Education.create({
          ...edu,
          user_type: "Advocate",
          user_id: user._id,
        });
        educationIds.push(newEdu._id);
      }
    }

    // Handle profile photo
    let profilePhotoUrl = null;
    if (req.file) {
      profilePhotoUrl = `/uploads/${req.file.filename}`;
    }

    // Create associated advocate profile
    const advocate = await Advocate.create({
      user_id: user._id,
      designation: designation || "",
      bar_council_enroll_num: bar_council_enroll_num || "",
      experience_years: experience_years
        ? Number.parseInt(experience_years)
        : 0,
      bio: bio || "",
      slug: generatedSlug || "",
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
      bar_memberships: requestData.bar_memberships || [],
    });

    // Populate the response
    const populatedAdvocate = await advocate.populate("user_id", "-password");

    res.status(201).json({
      message: "Advocate profile created successfully",
      user,
      advocate: populatedAdvocate,
    });
  } catch (error) {
    console.error("Advocate profile creation error:", error);

    // Clean up uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(uploadPath, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update advocate profile (with photo upload)
export const updateAdvocateProfile = async (req, res) => {
  let newProfilePhotoPath;
  try {
    const { id } = req.params;

    console.log("=== UPDATE ADVOCATE DEBUG ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("Content-Type:", req.headers["content-type"]);

    // Handle both JSON and FormData requests
    let requestData = {};

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      // FormData request - data is in req.body
      requestData = { ...req.body };

      // Parse JSON strings back to objects
      if (requestData.contact && typeof requestData.contact === "string") {
        try {
          requestData.contact = JSON.parse(requestData.contact);
        } catch (e) {
          console.error("Error parsing contact JSON:", e);
        }
      }

      if (
        requestData.available_hours &&
        typeof requestData.available_hours === "string"
      ) {
        try {
          requestData.available_hours = JSON.parse(requestData.available_hours);
        } catch (e) {
          console.error("Error parsing available_hours JSON:", e);
        }
      }

      if (
        requestData.fee_structure &&
        typeof requestData.fee_structure === "string"
      ) {
        try {
          requestData.fee_structure = JSON.parse(requestData.fee_structure);
        } catch (e) {
          console.error("Error parsing fee_structure JSON:", e);
        }
      }

      // Convert string booleans to actual booleans
      if (requestData.consultation_available === "true")
        requestData.consultation_available = true;
      if (requestData.consultation_available === "false")
        requestData.consultation_available = false;
      if (requestData.featured === "true") requestData.featured = true;
      if (requestData.featured === "false") requestData.featured = false;
    } else {
      // JSON request
      requestData = req.body;
    }

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
    } = requestData;

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
      advocate.experience_years = Number.parseInt(experience_years) || 0;
    if (bio !== undefined) advocate.bio = bio;
    if (languages !== undefined) advocate.languages = languages;
    if (office_address !== undefined) advocate.office_address = office_address;
    if (available_hours !== undefined)
      advocate.available_hours = available_hours;
    if (contact !== undefined) advocate.contact = contact;
    if (specialization_ids !== undefined)
      advocate.specialization_ids = specialization_ids;

    // Handle education update/creation
    if (Array.isArray(requestData.education)) {
      const updatedEducationIds = [];
      for (const edu of requestData.education) {
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

    // === Handle new profile photo ===
    if (req.file) {
      newProfilePhotoPath = path.join(uploadPath, req.file.filename);
      // Delete old profile photo if exists
      if (advocate.profile_photo_url) {
        const oldPhotoPath = path.join(
          uploadPath,
          path.basename(advocate.profile_photo_url)
        );
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      advocate.profile_photo_url = `/uploads/${req.file.filename}`;
    }

    await advocate.save();
    const populatedAdvocate = await advocate.populate("user_id", "-password");

    res
      .status(200)
      .json({
        message: "Advocate profile updated successfully",
        advocate: populatedAdvocate,
      });
  } catch (error) {
    if (newProfilePhotoPath && fs.existsSync(newProfilePhotoPath)) {
      fs.unlinkSync(newProfilePhotoPath);
    }
    console.error("Advocate profile update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete advocate profile
export const deleteAdvocateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the advocate profile
    const advocate = await Advocate.findById(id);
    if (!advocate) {
      return res.status(404).json({ message: "Advocate profile not found" });
    }
    // === Delete profile photo from uploads folder ===
    if (advocate.profile_photo_url) {
      const photoPath = path.join(
        uploadPath,
        path.basename(advocate.profile_photo_url)
      );
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    // Delete the advocate profile
    await Advocate.findByIdAndDelete(id);
    // Delete the associated user
    const deletedUser = await User.findByIdAndDelete(advocate.user_id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Associated user not found" });
    }
    res
      .status(200)
      .json({ message: "Advocate profile and photo deleted successfully" });
  } catch (error) {
    console.error("Delete advocate error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
