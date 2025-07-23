import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const CaseHistorySchema = new Schema({
  advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
  client_id: { type: Types.ObjectId, ref: "Client" },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  case_type: { type: String },
  court_name: { type: String },
  case_number: { type: String },
  plaintiff_name: { type: String },
  defendant_name: { type: String },
  status: { type: String, default: "Pending" },
  hearing_dates: [Date],
  verdict_date: Date,
  verdict_summary: String,
  documents: [{ name: String, url: String }],
  progress_notes: String,
  is_confidential: { type: Boolean, default: false },
}, { timestamps: true });
export default model("CaseHistory", CaseHistorySchema);
