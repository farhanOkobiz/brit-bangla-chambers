interface UserData {
  _id: string;
  role: string;
  full_name: string;
  email: string;
  phone: string;
  otp_verified: boolean;
  created_at: string;
  __v: number;
}

interface Consultation {
  doctorId: string;
  date: string;
  notes: string;
}

export interface ClientData {
  _id: string;
  user_id: UserData;
  nid_number: string;
  date_of_birth: string;
  gender: string;
  profile_photo: string;
  present_address: string;
  permanent_address: string;
  consultation_history: Consultation[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default interface ProfileData {
  user: UserData;
  client: ClientData;
}
