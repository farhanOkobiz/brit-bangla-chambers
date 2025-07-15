import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // Full URL to image (served from /uploads or CDN)
    link: { type: String }, // Optional external or internal URL
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
