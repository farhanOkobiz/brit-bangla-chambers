import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SpecializationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Criminal Law"
    icon: { type: String }, // e.g., "gavel"
    description: { type: String }, // e.g., "Bail, defense, appeals, etc."
  },
  {
    timestamps: true,
  }
);

export default model('Specialization', SpecializationSchema);
