import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const FaqSchema = new Schema(
  {
    audience: {
      type: String,
      enum: ['client', 'advocate', 'both'],
      required: true,
      default: 'both',
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

export default model('Faq', FaqSchema);
