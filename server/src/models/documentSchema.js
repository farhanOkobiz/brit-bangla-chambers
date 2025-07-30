import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const DocumentSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'Advocate',
    },
    file_url: { type: String, required: true },
    file_name: { type: String }, // Optional: actual name or title of document
    document_type: { type: String }, // Optional: e.g. "NID", "Enrollment Certificate", "Case File"
    verified: { type: Boolean, default: true },
    uploaded_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model('Document', DocumentSchema);
