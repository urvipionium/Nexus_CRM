export default function ActivityPanel() {
  return (
    <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">

      <h2 className="font-semibold mb-3">
        Activity
      </h2>

      <ul className="text-sm text-gray-600 space-y-3">

        <li className="flex gap-2 items-center">
          📞 Call with client
        </li>

        <li className="flex gap-2 items-center">
          📩 Email sent
        </li>

        <li className="flex gap-2 items-center">
          ✅ Deal closed
        </li>

      </ul>

    </div>
  );
}