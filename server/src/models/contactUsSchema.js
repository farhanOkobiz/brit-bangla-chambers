import mongoose from "mongoose";

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
  }
);

export default model("Contact", contactSchema);
