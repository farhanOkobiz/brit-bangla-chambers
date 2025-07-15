import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const MessageSchema = new Schema(
  {
    sender_id: { type: Types.ObjectId, required: true }, // user who sent the message
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSessionSchema = new Schema(
  {
    participants: {
      type: [{ type: Types.ObjectId, ref: 'User' }],
      validate: [arr => arr.length === 2, 'Participants must be exactly 2 users'],
      required: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export default model('ChatSession', ChatSessionSchema);
