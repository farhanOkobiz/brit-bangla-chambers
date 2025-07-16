import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const CaseHistorySchema = new Schema(
  {
    advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    is_confidential: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("CaseHistory", CaseHistorySchema);
