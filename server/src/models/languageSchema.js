import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const LanguageSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default model('Language', LanguageSchema);
