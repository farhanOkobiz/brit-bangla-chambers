import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", SubcategorySchema);
