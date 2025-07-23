import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const AdvocateSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    designation: { type: String },
    bar_council_enroll_num: { type: String },
    experience_years: { type: Number, default: 0 },
    profile_photo_url: { type: String },
    bio: { type: String },
    slug: { type: String, unique: true },

    office_address: { type: String },

    available_hours: {
      monday: { type: String },
      tuesday: { type: String },
      wednesday: { type: String },
      thursday: { type: String },
      friday: { type: String },
      saturday: { type: String },
      sunday: { type: String },
    },

    contact: {
      phone: { type: String },
      facebook: { type: String },
      linkedin: { type: String },
    },

    languages: [{ type: String }],  //settings
    specialization_ids: [{ type: Types.ObjectId, ref: "Specialization" }], //settings
    education_ids: [{ type: Types.ObjectId, ref: "Education" }],
    certification_ids: [{ type: Types.ObjectId, ref: "Certification" }],
    testimonial_ids: [{ type: Types.ObjectId, ref: "Testimonial" }],
    case_history_ids: [{ type: Types.ObjectId, ref: "CaseHistory" }],
    document_ids: [{ type: Types.ObjectId, ref: "Document" }],

    bar_memberships: [{
      bar_name: { type: String },
      membership_number: { type: String }
    }],

    avg_rating: { type: Number, default: 0 },
    total_reviews: { type: Number, default: 0 },

    consultation_available: { type: Boolean, default: false },

    fee_structure: {
      base_fee: { type: Number, default: 0 },
      show_publicly: { type: Boolean, default: false },
    },

    stats: {
      total_consultations: { type: Number, default: 0 },
      weekly_bookings: { type: Number, default: 0 },
      last_consultation: { type: Date },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("Advocate", AdvocateSchema);
