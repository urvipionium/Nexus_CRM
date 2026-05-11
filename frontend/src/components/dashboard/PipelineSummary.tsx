export default function PipelineSummary() {

  const pipeline = [
    { name: "New", value: 10, color: "bg-blue-500" },
    { name: "Proposal", value: 8, color: "bg-orange-500" },
    { name: "Negotiation", value: 5, color: "bg-purple-500" },
    { name: "Closed", value: 12, color: "bg-green-500" }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow">

      <h2 className="font-semibold mb-3">
        Deals Pipeline
      </h2>

      {pipeline.map((item, i) => (
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
  );
}