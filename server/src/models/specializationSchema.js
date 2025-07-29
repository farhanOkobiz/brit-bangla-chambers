import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SpecializationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
    details: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("Specialization", SpecializationSchema);
