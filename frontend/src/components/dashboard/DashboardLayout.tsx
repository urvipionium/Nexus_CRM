import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function DashboardLayout() {

  const chartData = [
    { month: "Jan", revenue: 20000 },
    { month: "Feb", revenue: 40000 },
    { month: "Mar", revenue: 35000 },
    { month: "Apr", revenue: 50000 },
    { month: "May", revenue: 65000 },
    { month: "Jun", revenue: 80000 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-xl">
          + Add Widget
        </button>
      </div>

      {/* 📊 KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "Revenue", value: "₹4,20,000" },
          { title: "Deals", value: "58" },
          { title: "Leads", value: "120" },
          { title: "Conversion", value: "34%" }
        ].map((card, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h2 className="text-xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* 📈 CHART + PIPELINE */}
      <div className="grid grid-cols-2 gap-4">

        {/* SALES CHART */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Sales Overview</h2>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIPELINE SUMMARY */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Deals Pipeline</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>New</span>
              <span className="font-semibold">10</span>
            </div>
            <div className="flex justify-between">
              <span>Proposal</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between">
              <span>Negotiation</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex justify-between">
              <span>Closed</span>
              <span className="font-semibold">12</span>
            </div>
          </div>
        </div>

      </div>

      {/* 📋 RECENT + ACTIVITY */}
      <div className="grid grid-cols-2 gap-4">

        {/* RECENT DEALS */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Recent Deals</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left">Name</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Website</td>
                <td>₹50,000</td>
                <td className="text-blue-500">New</td>
              </tr>
              <tr>
                <td>Mobile App</td>
                <td>₹1,20,000</td>
                <td className="text-orange-500">Proposal</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Activity</h2>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>📞 Call with client</li>
            <li>📩 Email sent</li>
            <li>✅ Deal closed</li>
          </ul>
        </div>

      </div>

    </div>
  );
}