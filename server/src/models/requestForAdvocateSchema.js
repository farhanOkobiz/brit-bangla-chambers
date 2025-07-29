import mongoose from "mongoose";
const { model, models, Schema } = mongoose;

const requestForAdvocateSchema = new Schema(
  {
    userMessage: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      nid: { type: String },
      presentAddress: { type: String },
      permanentAddress: { type: String },
      issueType: { type: String },
      message: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    advocateId: {
      type: Schema.Types.ObjectId,
      ref: "Advocate",
      required: true,
    },
    userMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestService",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model("RequestForAdvocate", requestForAdvocateSchema);
