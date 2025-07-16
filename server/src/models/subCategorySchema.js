import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SubcategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category", // assumes you have a Category model
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String, // store image URL
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Subcategory", SubcategorySchema);
