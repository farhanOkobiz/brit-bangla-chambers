import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ServiceRequestSchema = new Schema(
  {
    client_id: { type: Types.ObjectId, ref: "Client", required: true },

    service_id: { type: Types.ObjectId, ref: "Service", default: null },

    is_custom: { type: Boolean, default: false },

    custom_issue: {
      issue_type: { type: String },
      description: { type: String },
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "closed", "rejected"],
      default: "pending",
    },

    submitted_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model("ServiceRequest", ServiceRequestSchema);
