import type { Lead } from "../../types/lead";

export default function LeadKanban({ stages, leads, onOpen, onMove }: { stages: string[]; leads: Lead[]; onOpen: (lead: Lead) => void; onMove: (id: string, stage: string) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
      {stages.map((stage) => (
        <section key={stage} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">{stage}</h2>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">{leads.filter((lead) => lead.stage === stage).length}</span>
          </div>
          <div className="space-y-3">
            {leads.filter((lead) => lead.stage === stage).map((lead) => (
              <div key={lead.id} draggable className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm hover:border-blue-300 hover:bg-white" onClick={() => onOpen(lead)}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{lead.firstName} {lead.lastName}</p>
                    <p className="text-xs text-gray-500">{lead.company}</p>
                  </div>
                  <span className="text-xs font-semibold text-teal-700">{lead.score}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>{lead.owner}</span>
                  <span>{lead.source}</span>
                  <span>{lead.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lead.tags.map((tag) => <span key={tag} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">{tag}</span>)}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <button className="rounded-full bg-white px-2 py-1 text-blue-600 ring-1 ring-blue-100 hover:bg-blue-50" type="button" onClick={(e) => { e.stopPropagation(); onMove(lead.id, stage); }}>Move</button>
                  <span>{lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "No follow-up"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
