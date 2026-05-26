import type { Lead } from "../../types/lead";

export default function LeadTable({ leads, onOpen }: { leads: Lead[]; onOpen: (lead: Lead) => void }) {
  if (!leads.length) {
    return <div className="rounded-xl bg-white p-6 text-center text-gray-500">No leads match the selected filters.</div>;
  }

  return (
    <div className="rounded-xl bg-white shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Lead</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Owner</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Score</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Next follow-up</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {leads.map((lead) => (
            <tr key={lead.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onOpen(lead)}>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="font-semibold">{lead.firstName} {lead.lastName}</div>
                <div className="text-sm text-gray-500">{lead.email}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{lead.company}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{lead.stage}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{lead.owner}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{lead.score}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
