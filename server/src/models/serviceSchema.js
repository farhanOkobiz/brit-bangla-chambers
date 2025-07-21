import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ServiceSchema = new Schema(
  {
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Types.ObjectId, ref: "Subcategory", required: true },
    serviceImage: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_by: { type: Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "archived"],
      default: "active",
    },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Service", ServiceSchema);
