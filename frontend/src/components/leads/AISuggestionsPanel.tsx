import type { AISuggestion } from "../../types/lead";

const suggestions: AISuggestion[] = [
  { id: "s-1", title: "Send a warm follow-up", description: "Your lead is active. Send a personalized WhatsApp note within the next 24 hours." },
  { id: "s-2", title: "Propose bundle pricing", description: "The lead has high potential revenue. Suggest a package with a discount for faster conversion." },
  { id: "s-3", title: "Schedule a meeting", description: "The lead is in the early stage. Book a quick call to qualify needs and assign next steps." },
];

export default function AISuggestionsPanel({ score }: { score: number }) {
  const available = suggestions.filter((item) => (score < 60 ? item : item));

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">AI suggestions</h3>
          <p className="text-sm text-gray-500">Smart next actions for this lead.</p>
        </div>
      </div>
      <div className="space-y-3">
        {available.map((item) => (
          <div key={item.id} className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
            <div className="font-semibold text-gray-900">{item.title}</div>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
