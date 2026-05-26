import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function SalesChart() {

  const chartData = [
    { month: "Jan", revenue: 20000 },
    { month: "Feb", revenue: 40000 },
    { month: "Mar", revenue: 35000 },
    { month: "Apr", revenue: 50000 },
    { month: "May", revenue: 65000 },
    { month: "Jun", revenue: 80000 },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">

      <h2 className="font-semibold mb-3">
        Sales Overview
      </h2>

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
  );
}