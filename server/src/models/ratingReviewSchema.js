import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const RatingReviewSchema = new Schema(
  {
    client_id: { type: Types.ObjectId, ref: 'Client', required: true },
    advocate_id: { type: Types.ObjectId, ref: 'Advocate', required: true },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: { type: String },

    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model('RatingReview', RatingReviewSchema);
