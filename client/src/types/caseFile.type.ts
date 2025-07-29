type Party = {
  name: string;
  contact: string;
};

type Client = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
};

type Document = {
  _id: string;
  filename: string;
  file_url: string;
  uploaded_at: string;
};

export type CaseItem = {
  _id: string;
  case_number: string;
  title: string;
  advocate_id: string | null;
  client_id: Client;
  case_type: string;
  court_name: string;
  status: string;
  summary: string;
  filing_date: string;
  createdAt: string;
  updatedAt: string;
  parties: {
    plaintiff: Party;
    defendant: Party;
  };
  judgment: {
    decision_date: string;
    decision_summary: string;
    court_order_url: string;
  };
  documents: Document[];
  related_laws: string[];
  tags: string[];
};
