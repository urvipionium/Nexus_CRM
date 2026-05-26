export default function LeadDrawer({ lead, onClose }: any) {
  return (
    <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">{lead.name}</h2>
        <button onClick={onClose}>X</button>
      </div>

      <p className="text-sm text-gray-500">{lead.phone}</p>

      <div className="mt-4 space-y-2">

        <button className="w-full bg-green-500 text-white p-2 rounded">
          WhatsApp
        </button>

        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Call
        </button>

        <button className="w-full bg-purple-500 text-white p-2 rounded">
          Convert to Deal
        </button>

      </div>

      <div className="mt-6">
        <h3 className="font-medium">Timeline</h3>
        <p className="text-sm text-gray-500">No activity yet</p>
      </div>

    </div>
  );
}