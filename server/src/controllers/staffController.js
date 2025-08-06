import bcrypt from "bcryptjs";
import Staff from "../models/staffSchema.js";
import User from "../models/userSchema.js"
import { deleteUploadedFile } from "../utils/deleteUploadedFile.js";

// Create a new staff with basic info
export const createStaff = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      nidNumber,
      permanentAddress,
      presentAddress,
      phone
    } = req.body;

  

    // Check for duplicate NID or Email
    const existing = await User.findOne({
      $or: [{ nidNumber }, { email }]
    });

    if (existing) {
      return res.status(409).json({ message: "Staff with same NID or Email already exists" });
    }

     // 🔐 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // ✅ Create user
    const newUser = new User({
      full_name: fullName,
      email,
      phone,
      password: hashedPassword,
      role: "staff"
    });

    await newUser.save(); // First save the user

       // ✅ Create staff
    const newStaff = new Staff({
      fullName,
      email,
      password: hashedPassword,
      nidNumber,
      permanentAddress,
      presentAddress,
      phone,
      role: "staff",
      user_id: newUser._id,
    });

    await newStaff.save(); // Then save the staff profile

    return res.status(201).json({
      message: "Staff created successfully",
      staff: newStaff
    });

  } catch (error) {
    console.error("Create staff error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// Sob staff er data anar jonno
export const getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.status(200).json({ staffs });
  } catch (error) {
    console.error('Get all staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Specific ID diya staff info anar jonno
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ staff });
  } catch (error) {
    console.error('Get staff by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Specific ID diya staff info anar jonno
export const getStaffProfile = async (req, res) => {

  try {
    const id = req.user.id; // Assuming the ID is passed in the request object (e.g., from a token)
    
   const staff = await Staff.findOne({ user_id: id });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ staff });
  } catch (error) {
    console.error('Get staff by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update staff by ID (for management)
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find staff first
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Handle image upload and deletion
    if (req.file) {
      const newImagePath = `/uploads/${req.file.filename}`;

      // Delete old image if it exists
      if (staff.image) {
        const oldFilename = staff.image.replace("/uploads/", "");
        deleteUploadedFile(oldFilename); // your own utility function
      }

      updateData.image = newImagePath;
    }

    // Handle education parsing (if sent as stringified JSON)
    if (typeof updateData.education === "string") {
      updateData.education = JSON.parse(updateData.education);
    }

    // Update all other fields
    Object.keys(updateData).forEach((key) => {
      staff[key] = updateData[key];
    });

    await staff.save();

    return res.status(200).json({
      message: "Staff updated successfully",
      staff,
    });
  } catch (error) {
    console.error("Update staff error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// delete staff by ID 
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Delete staff error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
