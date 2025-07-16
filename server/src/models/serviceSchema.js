import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ServiceSchema = new Schema(
  {
    category: { type: String, required: true },
    subcategory: { type: String },
    serviceImage: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    created_by: { type: Types.ObjectId, ref: "SuperAdmin", required: true },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model("Service", ServiceSchema);
