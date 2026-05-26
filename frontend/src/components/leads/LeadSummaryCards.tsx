import type { Lead } from "../../types/lead";

export default function LeadSummaryCards({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const pipeline = leads.reduce((sum, lead) => sum + lead.revenue, 0);
  const hot = leads.filter((lead) => lead.tags.includes("Hot")).length;
  const converted = leads.filter((lead) => lead.status === "Converted").length;
  const conversion = total ? Math.round((converted / total) * 100) : 0;
  const followUps = leads.filter((lead) => lead.nextFollowUp).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <div className="text-sm text-gray-500">Total leads</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900">{total}</div>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <div className="text-sm text-gray-500">Hot leads</div>
        <div className="mt-2 text-3xl font-semibold text-red-600">{hot}</div>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <div className="text-sm text-gray-500">Pipeline value</div>
        <div className="mt-2 text-3xl font-semibold text-green-700">₹{pipeline.toLocaleString()}</div>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <div className="text-sm text-gray-500">Conversion</div>
        <div className="mt-2 text-3xl font-semibold text-blue-700">{conversion}%</div>
      </div>
    </div>
  );
}
