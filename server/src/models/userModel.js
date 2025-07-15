import mongoose from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Schema
const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["client", "advocate", "super_admin"],
      default: "client",
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    otp_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    admin_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
userSchema.pre("save", async function (next) {
  if (this.isModified("password_hash")) {
    try {
      this.password_hash = await argon2.hash(this.password_hash);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Password compare method
userSchema.methods.isPasswordCorrect = async function (userPassword) {
  try {
    return await argon2.verify(this.password_hash, userPassword);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Index
userSchema.index({ email: "text" });

// Export
export const User = mongoose.model("User", userSchema);
