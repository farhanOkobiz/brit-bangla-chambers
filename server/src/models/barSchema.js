import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BarMembershipSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Bangladesh Bar Council"
  },
  {
    timestamps: true,
  }
);

export default model('BarMembership', BarMembershipSchema);
