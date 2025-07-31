export default interface ClientCaseFile {
  _id: string;
  title: string;
  case_number: string;
  client_name: string;
  case_type: string;
  court_name: string;
  filing_date: string;
  next_hearing_date?: string;
  verdict_date?: string;
  status: "pending" | "in_progress" | "closed" | string; // fallback for unknown status
}
