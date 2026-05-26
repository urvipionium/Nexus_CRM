import type { LeadFilterState } from "../../types/lead";

const statuses = ["New", "Contacted", "Qualified", "Converted", "Lost"];

export default function LeadFilters({ filter, onChange, stages, owners }: { filter: LeadFilterState; onChange: (next: LeadFilterState) => void; stages: string[]; owners: string[] }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <input className="rounded-xl border border-gray-200 bg-gray-50 p-3" placeholder="Search leads" value={filter.query} onChange={(e) => onChange({ ...filter, query: e.target.value })} />
        <select className="rounded-xl border border-gray-200 bg-gray-50 p-3" value={filter.stage} onChange={(e) => onChange({ ...filter, stage: e.target.value })}>
          <option value="All">All stages</option>
          {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
        </select>
        <select className="rounded-xl border border-gray-200 bg-gray-50 p-3" value={filter.status} onChange={(e) => onChange({ ...filter, status: e.target.value })}>
          <option value="All">All statuses</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <select className="rounded-xl border border-gray-200 bg-gray-50 p-3" value={filter.owner} onChange={(e) => onChange({ ...filter, owner: e.target.value })}>
          <option value="All">All owners</option>
          {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
        </select>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600">Hot only</label>
          <input type="checkbox" checked={filter.hotOnly} onChange={(e) => onChange({ ...filter, hotOnly: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Min score</span>
          <input type="range" min="0" max="100" value={filter.minScore} onChange={(e) => onChange({ ...filter, minScore: Number(e.target.value) })} className="h-2 w-40 cursor-pointer accent-blue-600" />
          <span className="font-semibold text-blue-600">{filter.minScore}</span>
        </div>
      </div>
    </div>
  );
}
