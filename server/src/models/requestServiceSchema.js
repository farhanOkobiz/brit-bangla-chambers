import mongoose from "mongoose";

const { Schema, model } = mongoose;

const requestServiceSchema = new Schema(
  {
    userMessage: {
      name: String,
      email: String,
      phone: String,
      nid: String,
      presentAddress: String,
      permanentAddress: String,
      issueType: String,
      message: String,
      createdAt: { type: Date, default: Date.now },
    },
    status: {
      type: String,
      enum: ["pending", "sent_to_advocate", "accepted", "rejected"],
      default: "pending",
    },
    adminForwarded: {
      type: Boolean,
      default: false,
    },
    forwardedTo: {
      type: Schema.Types.ObjectId,
      ref: "Advocate",
      default: null,
    },
  },
  { timestamps: true }
);

export default model("RequestService", requestServiceSchema);
