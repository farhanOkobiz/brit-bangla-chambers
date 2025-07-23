import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const CertificationSchema = new Schema(
  {
    advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
    title: { type: String, required: true },         // e.g. "Cyber Law Certification"
    issuer: { type: String, required: true },        // e.g. "Bangladesh Bar Council", "UNDP"
    year: { type: Number, required: true },          // e.g. 2023
    certificate_type: { type: String },              // e.g. "Enrollment", "Training", "License"
    certificate_url: { type: String },               // link to uploaded file or proof
    description: { type: String },                   // short summary or notes
  },
  {
    timestamps: true,
  }
);


export default model("Certification", CertificationSchema);
