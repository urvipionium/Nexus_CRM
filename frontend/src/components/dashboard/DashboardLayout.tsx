import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { motion } from "framer-motion";

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
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition">
          + Add Widget
        </button>
      </div>

      {/* 📊 KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "Revenue", value: "₹4,20,000", color: "from-green-400 to-green-600" },
          { title: "Deals", value: "58", color: "from-blue-400 to-blue-600" },
          { title: "Leads", value: "120", color: "from-purple-400 to-purple-600" },
          { title: "Conversion", value: "34%", color: "from-pink-400 to-pink-600" }
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${card.color} text-white p-5 rounded-2xl shadow-lg`}
          >
            <p className="text-sm opacity-80">{card.title}</p>
            <h2 className="text-2xl font-bold">{card.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* 📈 CHART + PIPELINE */}
      <div className="grid grid-cols-2 gap-4">

        {/* SALES CHART */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Sales Overview</h2>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIPELINE */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Deals Pipeline</h2>

          {[
            { name: "New", value: 10, color: "bg-blue-500" },
            { name: "Proposal", value: 8, color: "bg-orange-500" },
            { name: "Negotiation", value: 5, color: "bg-purple-500" },
            { name: "Closed", value: 12, color: "bg-green-500" }
          ].map((item, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${item.value * 8}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 📋 TABLE + ACTIVITY */}
      <div className="grid grid-cols-2 gap-4">

        {/* TABLE */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">
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
              <tr className="hover:bg-gray-100 transition">
                <td>Website</td>
                <td>₹50,000</td>
                <td className="text-blue-500">New</td>
              </tr>
              <tr className="hover:bg-gray-100 transition">
                <td>Mobile App</td>
                <td>₹1,20,000</td>
                <td className="text-orange-500">Proposal</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Activity</h2>

          <ul className="text-sm text-gray-600 space-y-3">
            <li className="flex gap-2 items-center">📞 Call with client</li>
            <li className="flex gap-2 items-center">📩 Email sent</li>
            <li className="flex gap-2 items-center">✅ Deal closed</li>
          </ul>
        </div>

      </div>

    </div>
  );
}