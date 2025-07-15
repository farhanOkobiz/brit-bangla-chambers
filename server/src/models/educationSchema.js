import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const EducationSchema = new Schema(
  {
    advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
    degree: { type: String, required: true },
    institute: { type: String, required: true },
    year: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Education", EducationSchema);
