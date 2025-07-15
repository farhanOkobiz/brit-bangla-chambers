import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const DocumentSchema = new Schema(
  {
    advocate_id: { type: Types.ObjectId, ref: 'Advocate', required: true },
    type: {
      type: String,
      required: true,
      enum: ['nid', 'bar_certificate', 'gown_photo'],
    },
    file_url: { type: String, required: true },
    verified: { type: Boolean, default: false },
    uploaded_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model('Document', DocumentSchema);
