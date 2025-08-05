import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const staffSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nidNumber: {
    type: String,
    required: true,
    unique: true
  },
  permanentAddress: {
    type: String,
    required: true
  },
  presentAddress: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },

  // Optional Educational Qualification
  education: [{
    degree: String,
    passingYear: String
  }],

  // Optional Job Information
  designation: {
    type: String
  },
  department: {
    type: String
  },
  joiningDate: {
    type: Date
  },
  dutyShift: {
    type: String
  },
  salaryStructure: {
    type: String
  },
  incrementHistory: [{
    date: Date,
    details: String
  }],
  promotionHistory: [{
    date: Date,
    newPosition: String
  }],
  jobResponsibilities: {
    type: String
  },
  role: {
    type: String,
    default: 'staff'
  }

}, {
  timestamps: true
});

export default model('Staff', staffSchema);
