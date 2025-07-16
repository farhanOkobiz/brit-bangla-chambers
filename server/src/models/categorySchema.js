import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
    details: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("Category", CategorySchema);
