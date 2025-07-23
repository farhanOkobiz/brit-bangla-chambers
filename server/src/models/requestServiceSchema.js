import mongoose from "mongoose";

const { Schema, model } = mongoose;

const requestServiceSchema = new Schema(
  {
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
    },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("RequestService", requestServiceSchema);
