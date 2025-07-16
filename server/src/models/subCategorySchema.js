import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SubcategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("Subcategory", SubcategorySchema);
