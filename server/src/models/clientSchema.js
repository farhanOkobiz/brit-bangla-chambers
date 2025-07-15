import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ClientSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    preferred_language: { type: String },
    consultation_history: [{ type: Types.ObjectId, ref: "Consultation" }],
    present_address: { type: String },
    permanent_address: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("Client", ClientSchema);
