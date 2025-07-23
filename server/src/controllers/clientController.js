import userSchema from "../models/userSchema.js";
import clientSchema from "../models/clientSchema.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const showProfile = async (req, res) => {
  try {
    const user_id = req.user._id;

    // Get basic user data (excluding password)
    const user = await userSchema.findById(user_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Get client-specific data
    const client = await clientSchema
      .findOne({ user_id })
      .populate("user_id", "-password");
    if (!client) {
      return res.status(404).json({ message: "Client profile not found" });
    }
    // Return combined profile
    res.status(200).json({ user, client });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const showProfileByUserId = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await userSchema.findById(user_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const client = await clientSchema.findOne({ user_id }).select("-password");
    if (!client) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    res.status(200).json({ user, client });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const showProfileByClientId = async (req, res) => {
  try {
    const client_id = req.params.id;
    const client = await clientSchema
      .findById(client_id)
      .populate("user_id", "-password");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ client });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const showAllClients = async (req, res) => {
  try {
    const clients = await clientSchema.find().populate("user_id", "-password");
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: "No clients found" });
    }
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createClientProfile = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      password,
      nidNumber,
      dateOfBirth,
      gender,
      presentAddress,
      profilePhoto,
      permanentAddress,
    } = req.body;

    // Check if user already exists
    const existingUser = await userSchema.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userSchema.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role: "client", // make sure role is set
    });

    // Create associated client profile
    const client = await clientSchema.create({
      user_id: user._id,
      nid_number: nidNumber,
      date_of_birth: dateOfBirth,
      gender,
      profile_photo: profilePhoto,
      present_address: presentAddress,
      permanent_address: permanentAddress,
      status: "active",
    });

    res.status(201).json({
      message: "Client profile created successfully",
      user,
      client,
    });
  } catch (error) {
    console.error("Client profile creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ESM-compatible __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "..", "uploads");

const updateClientProfile = async (req, res) => {
  let newProfilePhotoPath; // Define for error cleanup

  try {
    const { id } = req.params;
    const {
      full_name,
      phone,
      nidNumber,
      dateOfBirth,
      gender,
      presentAddress,
      permanentAddress,
      status
    } = req.body;

    // Find the client
    const client = await clientSchema.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    // Find the associated user
    const user = await userSchema.findById(client.user_id);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // === Update user fields ===
    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    await user.save();

    // === Update client fields ===
    if (nidNumber) client.nid_number = nidNumber;
    if (dateOfBirth) client.date_of_birth = dateOfBirth;
    if (gender) client.gender = gender;
    if (presentAddress) client.present_address = presentAddress;
    if (permanentAddress) client.permanent_address = permanentAddress;
    if (status) client.status = status;

    // === Handle new profile photo ===
    if (req.file) {
      newProfilePhotoPath = path.join(uploadPath, req.file.filename);

      // Delete old profile photo if exists
      if (client.profile_photo) {
        const oldPhotoPath = path.join(
          uploadPath,
          path.basename(client.profile_photo)
        );
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      client.profile_photo = `/uploads/${req.file.filename}`;
    }

    await client.save();

    const populatedClient = await client.populate("user_id", "-password");

    res.status(200).json({
      message: "Client profile updated successfully",
      client: populatedClient,
    });
  } catch (error) {
    // Cleanup uploaded file if error occurred
    if (newProfilePhotoPath && fs.existsSync(newProfilePhotoPath)) {
      fs.unlinkSync(newProfilePhotoPath);
    }

    console.error("Client profile update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteClientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the client profile
    const client = await clientSchema.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    // === Delete profile photo from uploads folder ===
    if (client.profile_photo) {
      const photoPath = path.join(
        uploadPath,
        path.basename(client.profile_photo)
      );
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Delete the client profile
    await clientSchema.findByIdAndDelete(id);

    // Delete the associated user
    const deletedUser = await userSchema.findByIdAndDelete(client.user_id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    res
      .status(200)
      .json({ message: "Client profile and photo deleted successfully" });
  } catch (error) {
    console.error("Delete client error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  showProfile,
  showProfileByUserId,
  showProfileByClientId,
  showAllClients,
  createClientProfile,
  updateClientProfile,
  deleteClientProfile,
};
