export default interface ClientDetailsCaseFile {
  _id: string;
  title: string;
  case_number: string;
  status: "pending" | "in_progress" | "closed" | string;
  case_type: string;
  filing_date: string;
  court_name: string;
  client_name: string;
  summary?: string;
  next_hearing_date?: string;
  verdict_date?: string;
  parties?: {
    plaintiff?: {
      name: string;
      contact: string;
    };
    defendant?: {
      name: string;
      contact: string;
    };
  };
  judgment?: {
    decision_summary?: string;
    decision_date?: string;
  };
  documents: {
    _id?: string;
    documentUrl: string;
    uploaded_at: string;
    documentTitle?: string;
  }[];
}
