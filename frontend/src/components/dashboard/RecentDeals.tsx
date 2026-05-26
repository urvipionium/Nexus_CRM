export default function RecentDeals() {
  return (
    <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">

      <h2 className="font-semibold mb-3">
        Recent Deals
      </h2>

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
  );
}