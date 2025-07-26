// models/educationSchema.js
import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree_title: { type: String, required: true },
    institution: { type: String, required: true },
    passing_year: { type: Number, required: true },
    certificate_url: { type: String }, // Optional
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "user_type",
    },
    user_type: { type: String, required: true, enum: ["Advocate", "Client"] },
  },
  { timestamps: true }
);

export default mongoose.model("Education", educationSchema);
