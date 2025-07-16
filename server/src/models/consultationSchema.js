import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const MessageSchema = new Schema(
  {
    sender_id: { type: Types.ObjectId, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConsultationSchema = new Schema(
  {
    client_id: { type: Types.ObjectId, ref: "Client", required: true },
    advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
    service_request_id: {
      type: Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    scheduled_at: { type: Date, required: true },

    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled"],
      default: "requested",
    },

    notes: { type: String },

    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export default model("Consultation", ConsultationSchema);
