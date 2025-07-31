interface Consultation {
  doctorId: string;
  date: string;
  notes: string;
}

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

interface ClientData {
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

export interface UpdateClientInfoProps {
  clientData: ClientData;
  onUpdate: (updatedData: ClientData) => void;
}

export default interface UpdateFormData {
  full_name: string;
  phone: string;
  nidNumber: string;
  dateOfBirth: string;
  gender: string;
  presentAddress: string;
  permanentAddress: string;
  status: string;
}
