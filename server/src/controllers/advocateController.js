import Advocate from "../models/advocateSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Education from "../models/educationSchema.js";
import Certification from "../models/certificationSchema.js";
import Testimonial from "../models/testimonialSchema.js";
import CaseHistory from "../models/caseHistory.js";
import Document from "../models/documentSchema.js";

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
    const advocate = await Advocate.findOne({ user_id }).populate("user_id", "-password");
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
      // verified_by_admin,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-generate slug if not provided
    let generatedSlug;
    if (!generatedSlug && full_name) {
      generatedSlug = full_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
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
    let educationIds = [];
    if (Array.isArray(education)) {
      for (const edu of education) {
        const newEdu = await Education.create({
          ...edu,
          user_type: "Advocate",
          user_id: user._id
        });
        educationIds.push(newEdu._id);
      }
    }

    // Create associated advocate profile
    const advocate = await Advocate.create({
      user_id: user._id,
      designation,
      bar_council_enroll_num,
      experience_years,
      bio,
      slug: generatedSlug,
      office_address,
      available_hours,
      contact,
      languages,
      specialization_ids,
      education_ids: educationIds,
      certification_ids,
      testimonial_ids,
      case_history_ids,
      document_ids,
      consultation_available,
      fee_structure,
      stats,
      status,
      featured,
      // verified_by_admin,
    });

    res.status(201).json({ message: "Advocate profile created successfully", user, advocate });
  } catch (error) {
    console.error("Advocate profile creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update advocate profile (with photo upload)
export const updateAdvocateProfile = async (req, res) => {
  let newProfilePhotoPath;
  try {
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
    } = req.body;
    // Handle empty string for booleans
    const safeConsultationAvailable = consultation_available === "" ? undefined : consultation_available;
    const safeFeatured = featured === "" ? undefined : featured;
    // For nested fee_structure.show_publicly
    if (fee_structure && typeof fee_structure.show_publicly !== "undefined") {
      fee_structure.show_publicly = fee_structure.show_publicly === "" ? undefined : fee_structure.show_publicly;
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
    if (designation) advocate.designation = designation;
    if (bar_council_enroll_num) advocate.bar_council_enroll_num = bar_council_enroll_num;
    if (experience_years) advocate.experience_years = experience_years;
    if (bio) advocate.bio = bio;
    if(languages) advocate.languages = languages;
    if (office_address) advocate.office_address = office_address;
    if (available_hours) advocate.available_hours = available_hours;
    if (contact) advocate.contact = contact;
    if (specialization_ids) advocate.specialization_ids = specialization_ids;
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
            user_id: advocate.user_id
          });
          updatedEducationIds.push(newEdu._id);
        }
      }
      advocate.education_ids = updatedEducationIds;
    } else if (education_ids) {
      advocate.education_ids = education_ids;
    }
    if (certification_ids) advocate.certification_ids = certification_ids;
    if (testimonial_ids) advocate.testimonial_ids = testimonial_ids;
    if (case_history_ids) advocate.case_history_ids = case_history_ids;
    if (document_ids) advocate.document_ids = document_ids;
    if (safeConsultationAvailable !== undefined) advocate.consultation_available = safeConsultationAvailable;
    if (fee_structure) advocate.fee_structure = fee_structure;
    if (stats) advocate.stats = stats;
    if (status) advocate.status = status;
    if (safeFeatured !== undefined) advocate.featured = safeFeatured;

    // === Handle new profile photo ===
    if (req.file) {
      newProfilePhotoPath = path.join(uploadPath, req.file.filename);
      // Delete old profile photo if exists
      if (advocate.profile_photo_url) {
        const oldPhotoPath = path.join(uploadPath, path.basename(advocate.profile_photo_url));
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      advocate.profile_photo_url = `/uploads/${req.file.filename}`;
    }

    await advocate.save();
    const populatedAdvocate = await advocate.populate("user_id", "-password");

    res.status(200).json({ message: "Advocate profile updated successfully", advocate: populatedAdvocate });
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
      const photoPath = path.join(uploadPath, path.basename(advocate.profile_photo_url));
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
    res.status(200).json({ message: "Advocate profile and photo deleted successfully" });
  } catch (error) {
    console.error("Delete advocate error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
