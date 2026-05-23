import type { CustomField, Lead, LeadNote, LeadTask, LeadActivity, WhatsAppMessage, LeadSource, LeadStatus } from "../types/lead";

const LEADS_KEY = "crm_leads_v1";
const STAGES_KEY = "crm_lead_stages_v1";
const FIELDS_KEY = "crm_lead_fields_v1";

const defaultStages = ["New", "Contacted", "Qualified", "Won", "Converted"];

const defaultFields: CustomField[] = [
  { id: "industry", key: "industry", label: "Industry", type: "text", value: "" },
  { id: "rating", key: "rating", label: "Rating", type: "text", value: "" },
  { id: "sourceDetail", key: "sourceDetail", label: "Source detail", type: "text", value: "" },
];

const seedLeads: Lead[] = [
  {
    id: "L-1001",
    firstName: "Aisha",
    lastName: "Sharma",
    company: "NovaTech",
    email: "aisha.sharma@novatech.com",
    phone: "+91 98765 43210",
    source: "Website",
    stage: "Contacted",
    status: "Contacted",
    owner: "Ravi",
    revenue: 45000,
    nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["Hot", "Inbound"],
    score: 72,
    custom: { industry: "SaaS", rating: "A", sourceDetail: "Web form" },
    notes: [
      { id: "n-1", text: "Reached out by email; waiting for reply.", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    tasks: [
      { id: "t-1", title: "Send pricing deck", dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), completed: false },
    ],
    activities: [
      { id: "a-1", type: "email", text: "Intro email sent.", ts: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), user: "Ravi" },
    ],
    chat: [
      { id: "c-1", sender: "me", text: "Hi Aisha, I sent the proposal. Please review.", ts: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { id: "c-2", sender: "contact", text: "Thanks, I will look today.", ts: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "L-1002",
    firstName: "Vikram",
    lastName: "Mistry",
    company: "Atlas Retail",
    email: "vikram@atlasretail.in",
    phone: "+91 91234 56789",
    source: "Referral",
    stage: "New",
    status: "New",
    owner: "Neha",
    revenue: 22000,
    nextFollowUp: null,
    tags: ["Warm"],
    score: 48,
    custom: { industry: "Retail", rating: "B", sourceDetail: "Referral" },
    notes: [],
    tasks: [],
    activities: [],
    chat: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function readLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(seedLeads));
      return seedLeads;
    }
    return JSON.parse(raw) as Lead[];
  } catch {
    return seedLeads;
  }
}

function writeLeads(leads: Lead[]) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

function readStages(): string[] {
  try {
    const raw = localStorage.getItem(STAGES_KEY);
    if (!raw) {
      localStorage.setItem(STAGES_KEY, JSON.stringify(defaultStages));
      return defaultStages;
    }
    return JSON.parse(raw) as string[];
  } catch {
    return defaultStages;
  }
}

function writeStages(stages: string[]) {
  localStorage.setItem(STAGES_KEY, JSON.stringify(stages));
}

function readFields(): CustomField[] {
  try {
    const raw = localStorage.getItem(FIELDS_KEY);
    if (!raw) {
      localStorage.setItem(FIELDS_KEY, JSON.stringify(defaultFields));
      return defaultFields;
    }
    return JSON.parse(raw) as CustomField[];
  } catch {
    return defaultFields;
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  return Promise.resolve(readLeads());
}

export async function createLead(payload: Partial<Lead>): Promise<Lead> {
  const leads = readLeads();
  const now = new Date().toISOString();
  const lead: Lead = {
    id: `L-${Date.now()}`,
    firstName: payload.firstName || "",
    lastName: payload.lastName || "",
    company: payload.company || "",
    email: payload.email || "",
    phone: payload.phone || "",
    source: payload.source || "Manual",
    stage: payload.stage || defaultStages[0],
    status: payload.status || "New",
    owner: payload.owner || "Unassigned",
    revenue: payload.revenue || 0,
    nextFollowUp: payload.nextFollowUp || null,
    tags: payload.tags || [],
    score: payload.score || 30,
    custom: payload.custom || {},
    notes: payload.notes || [],
    tasks: payload.tasks || [],
    activities: payload.activities || [],
    chat: payload.chat || [],
    createdAt: now,
    updatedAt: now,
  };
  leads.unshift(lead);
  writeLeads(leads);
  return Promise.resolve(lead);
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
  const leads = readLeads();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index === -1) return Promise.resolve(null);
  const updated = { ...leads[index], ...data, updatedAt: new Date().toISOString() };
  leads[index] = updated;
  writeLeads(leads);
  return Promise.resolve(updated);
}

export async function deleteLead(id: string): Promise<void> {
  const leads = readLeads().filter((lead) => lead.id !== id);
  writeLeads(leads);
  return Promise.resolve();
}

export async function fetchStages(): Promise<string[]> {
  return Promise.resolve(readStages());
}

export async function saveStages(stages: string[]): Promise<void> {
  writeStages(stages);
  return Promise.resolve();
}

export async function fetchCustomFields(): Promise<CustomField[]> {
  return Promise.resolve(readFields());
}
