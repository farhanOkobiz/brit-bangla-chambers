import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const CertificationSchema = new Schema(
  {
    advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    year: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Certification", CertificationSchema);
