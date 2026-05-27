export default function Reports() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports</h1>
      <p className="text-gray-600">
        This is the Reports page. Use this area to view your analytics and sales
        data.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Sales Summary</h2>
          <p className="text-sm text-gray-500">
            Overview of your deal performance this week.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">WhatsApp Activity</h2>
          <p className="text-sm text-gray-500">
            Recent messaging and customer engagement insights.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Lead Conversion</h2>
          <p className="text-sm text-gray-500">
            Track how many leads turn into deals.
          </p>
        </div>
      </div>
    </div>
  );
}
