import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/userSchema.js";
import Client from "../models/clientSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "BritBangla_jwt_secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "BritBangla_JWT_REFRESH_SECRET";

export const register = async (req, res) => {
  try {
    console.log("Registration attempt:", req.body);
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
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user (basic info only)
    const user = await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
    });
    console.log("User created:", user._id);
    // Create client profile (extended info)
    const client = await Client.create({
      user_id: user._id,
      nid_number: nidNumber,
      date_of_birth: dateOfBirth,
      gender,
      profile_photo: profilePhoto,
      present_address: presentAddress,
      permanent_address: permanentAddress,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user, client });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  console.log("Login attempt:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if OTP is verified
    if (!user.otp_verified) {
      return res.status(470).json({
        message: "OTP verification required",
        userId: user._id,
        email: user.email,
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // 30 minute
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refresh = async (req, res) => {
  // Get refreshToken from cookies
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    // Issue a new access token (short-lived)

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const token = jwt.sign({ id: payload.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1m",
    });
    // Issue a new refresh token with a new 30-day expiration
    const newRefreshToken = jwt.sign(
      { id: payload.id, role: user.role },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // 30 minute
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({ message: "Token refreshed" });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otp_expiry = Date.now() + 3 * 60 * 1000; // 3 minutes
  await user.save();

  await sendEmail(
    user.email,
    "Your OTP Code",
    `Your OTP code is: ${otp}. It will expire in 3 minutes.`
  );

  res.json({ message: "OTP sent to email" });
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp === otp && user.otp_expiry > Date.now()) {
    user.otp_verified = true;
    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();

    // Issue tokens
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // 30 minute
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({ message: "OTP verified successfully", user });
  } else {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
};

//return role
export const checkAuth = (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return res.json({ ok: true, role: decoded.role });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const showAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ ok: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch users" });
  }
};

// Get own profile (from cookie token)
export const getOwnProfile = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
