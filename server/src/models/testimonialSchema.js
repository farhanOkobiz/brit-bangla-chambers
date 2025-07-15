import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const TestimonialSchema = new Schema(
  {
    advocate_id: { type: Types.ObjectId, ref: "Advocate", required: true },
    client_name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Testimonial", TestimonialSchema);
