import mongoose from "mongoose";

const { Schema, model } = mongoose;

const requestServiceSchema = new Schema(
  {
<<<<<<< HEAD
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
=======
    specialization : {
      type: mongoose.Types.ObjectId,
      ref: "Specialization",
      
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nid: { type: String, required: true },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    issueType: {
      type: String,
      required: true,
>>>>>>> 6cc6538000aa799539d065ccee59dcd5cab03db6
    },
  },
  { timestamps: true }
);

export default model("RequestService", requestServiceSchema);
