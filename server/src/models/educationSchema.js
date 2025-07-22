import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const EducationSchema = new Schema(
  {
    user_type: {
      type: String,
      enum: ['Advocate', 'Client'],
      required: true,
    },
    user_id: {
      type: Types.ObjectId,
      required: true,
      refPath: 'user_type', // dynamic ref
    },
    degree: { type: String, required: true },
    institute: { type: String, required: true },
    year: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Education", EducationSchema);
