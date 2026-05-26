import React from "react";
import type { Lead } from "../types/lead";
import * as svc from "../services/leadService";

type ContextType = {
  leads: Lead[];
  stages: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  create: (data: Partial<Lead>) => Promise<Lead>;
  update: (id: string, data: Partial<Lead>) => Promise<Lead | null>;
  remove: (id: string) => Promise<void>;
  move: (id: string, stage: string) => Promise<Lead | null>;
};

const LeadsCtx = React.createContext<ContextType | null>(null);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [stages, setStages] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function refresh() {
    setLoading(true);
    const [l, s] = await Promise.all([svc.fetchLeads(), svc.fetchStages()]);
    setLeads(l);
    setStages(s);
    setLoading(false);
  }

  React.useEffect(() => {
    refresh();
  }, []);

  async function create(data: Partial<Lead>) {
    const nl = await svc.createLead(data);
    setLeads((prev) => [nl, ...prev]);
    return nl;
  }

  async function update(id: string, data: Partial<Lead>) {
    const res = await svc.updateLead(id, data);
    if (res) setLeads((prev) => prev.map((lead) => (lead.id === id ? res : lead)));
    return res;
  }

  async function remove(id: string) {
    await svc.deleteLead(id);
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }

  async function move(id: string, stage: string) {
    return update(id, { stage });
  }

  return (
    <LeadsCtx.Provider value={{ leads, stages, loading, refresh, create, update, remove, move }}>
      {children}
    </LeadsCtx.Provider>
  );
};

export function useLeads() {
  const ctx = React.useContext(LeadsCtx);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}
