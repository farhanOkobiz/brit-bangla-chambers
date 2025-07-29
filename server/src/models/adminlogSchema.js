import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const AdminLogSchema = new Schema(
  {
    admin_id: { type: Types.ObjectId, ref: "Admin", required: true },

    action: {
      type: String,
      enum: ["verify_user", "approve_advocate", "update_service"],
      required: true,
    },

    target_id: { type: Types.ObjectId, required: true },

    target_type: {
      type: String,
      enum: ["user", "service", "advocate"],
      required: true,
    },

    notes: { type: String },

    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model("AdminLog", AdminLogSchema);
