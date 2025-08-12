import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['client', 'advocate', 'staff', 'admin'],
    default: 'client',
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp_verified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otp_expiry: {
    type: Date
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

export default mongoose.model('User', userSchema);
