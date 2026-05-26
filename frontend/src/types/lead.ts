export type LeadSource = "Manual" | "WhatsApp" | "Website" | "Referral";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";
export type LeadStage = string;

export type LeadActivity = {
  id: string;
  type: "email" | "call" | "meeting" | "note" | "task";
  text: string;
  ts: string;
  user: string;
};

export type LeadNote = {
  id: string;
  text: string;
  createdAt: string;
};

export type LeadTask = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

export type WhatsAppMessage = {
  id: string;
  sender: "me" | "contact";
  text: string;
  ts: string;
};

export type AISuggestion = {
  id: string;
  title: string;
  description: string;
};

export type CustomField = {
  id: string;
  key: string;
  label: string;
  type: "text" | "number" | "date";
  value: string;
};

export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  stage: LeadStage;
  status: LeadStatus;
  owner: string;
  revenue: number;
  nextFollowUp: string | null;
  tags: string[];
  score: number;
  custom: Record<string, string>;
  notes: LeadNote[];
  tasks: LeadTask[];
  activities: LeadActivity[];
  chat: WhatsAppMessage[];
  createdAt: string;
  updatedAt: string;
};

export type LeadFilterState = {
  query: string;
  stage: string;
  status: string;
  owner: string;
  minScore: number;
  hotOnly: boolean;
};
