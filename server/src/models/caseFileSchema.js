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
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        return `CASE-${minutes}${seconds}`;
      },
    },
    title: { type: String, required: true }, // eg: "Land Dispute between X and Y"

    advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
    client_id: { type: Types.ObjectId, ref: "User" }, // optional

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

    documents: [
      {
        filename: String,
        file_url: String,
        uploaded_at: { type: Date, default: Date.now },
      },
    ],

    hearing_dates: [
      {
        date: Date,
        judge: String,
        description: String, // what happened in the hearing
      },
    ],

    judgment: {
      decision_date: Date,
      decision_summary: String,
      court_order_url: String, // optional file link
    },

    related_laws: [String], // e.g. ["Section 420 IPC", "Civil Procedure Code"]
    tags: [String], // optional, for searching/filtering
  },
  { timestamps: true }
);

export default model("CaseFile", CaseFileSchema);
