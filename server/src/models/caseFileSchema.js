import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const CaseFileSchema = new Schema(
  {
    case_number: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const now = new Date();
        const day = now.getDate();
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        return `CASE-${day}${minutes}${seconds}`;
      },
    },

    title: { type: String, required: true },

    advocate_id: { type: Types.ObjectId, required: true },

    client_id: { type: Types.ObjectId, ref: "User" }, // optional
    client_name: { type: String },
    case_type: {
      type: String,
    },
    court_name: { type: String },
    status: {
      type: String,
      enum: ["pending", "in_progress", "closed"],
      default: "pending",
    },

    summary: { type: String }, // brief summary of the case
    filing_date: { type: Date, default: Date.now },

    parties: {
      plaintiff: { name: String, contact: String },
      defendant: { name: String, contact: String },
    },

    next_hearing_date: { type: Date },

    verdict_date: { type: Date },

    judgment: {
      decision_date: Date,
      decision_summary: String,
      court_order_url: String, // optional file link
    },
    documents: [{
      type: String
    }],
    documentTitle: {
      type: String
    },
    related_laws: [String], // e.g. ["Section 420 IPC", "Civil Procedure Code"]
    tags: [String], // optional, for searching/filtering
  },
  { timestamps: true }
);

export default model("CaseFile", CaseFileSchema);
