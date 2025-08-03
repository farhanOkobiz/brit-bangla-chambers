import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const BlogSchema = new Schema(
  {
    image: { type: String },

    title: { type: String, required: true },

    content: { type: String, required: true },

    tags: [{ type: String }],

    published_at: { type: Date, default: Date.now, required: true },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: { type: String, required: true, enum: ["Admin", "Advocate"] },
    author_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Blog", BlogSchema);
