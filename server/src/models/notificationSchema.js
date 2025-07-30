import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    message: String,
    relatedCaseId: { type: mongoose.Schema.Types.ObjectId, ref: "CaseFile" },
    case_number: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
