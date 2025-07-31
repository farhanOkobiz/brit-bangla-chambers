interface AvailableHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

interface Contact {
  email?: string;
  phone?: string;
}

interface FeeStructure {
  hourly_rate?: number;
  fixed_rate?: number;
  currency?: string;
}

interface Stats {
  total_cases?: number;
  successful_cases?: number;
  lost_cases?: number;

  total_consultations?: number;
  weekly_bookings?: number;
  last_consultation?: string;
}

export interface Advocate {
  _id: string;

  user_id: {
    _id: string;
    full_name: string;
    email: string;
  };

  designation: string;
  bar_council_enroll_num: string;
  experience_years: number;
  profile_photo_url: string;
  bio: string;
  slug: string;
  office_address: string;
  available_hours: AvailableHours;
  contact: Contact;
  languages: string[];
  specialization_ids: string[];
  education_ids: string[];
  certification_ids: string[];
  testimonial_ids: string[];
  case_history_ids: string[];
  document_ids: string[];
  bar_memberships: string[];

  avg_rating: number;
  total_reviews: number;
  consultation_available: boolean;
  fee_structure: FeeStructure;
  stats: Stats;

  status: "pending" | "approved" | "rejected";

  featured?: boolean;

  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
