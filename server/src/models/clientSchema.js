import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ClientSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    nid_number: { type: String },
    date_of_birth: { type: String },
    gender: { type: String },
    profile_photo: { type: String },
    present_address: { type: String },
    permanent_address: { type: String },
    preferred_language: { type: String },
    consultation_history: [{ type: Types.ObjectId, ref: "Consultation" }],
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Client", ClientSchema);
