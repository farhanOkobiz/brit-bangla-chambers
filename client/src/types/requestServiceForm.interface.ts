export type FormData = {
  name: string;
  email: string;
  phone: string;
  nid: string;
  presentAddress: string;
  permanentAddress: string;
  issueType: string;
  message: string;
};

export default interface Payload {
  userMessage: FormData;
  serviceId?: number;
}
