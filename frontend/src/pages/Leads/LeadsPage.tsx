import { useState } from "react";

const stages = ["New", "Contacted", "Qualified", "Won"];

export default function DealsPage() {
  const [deals, setDeals] = useState([
    { id: 1, name: "Rahul Deal", stage: "New", value: 20000 },
  ]);

  const onDragStart = (e: any, id: number) => {
    e.dataTransfer.setData("id", id);
  };

  const onDrop = (e: any, stage: string) => {
    const id = e.dataTransfer.getData("id");

    setDeals((prev) =>
      prev.map((d) =>
        d.id == id ? { ...d, stage } : d
      )
    );
  };

  return (
    <div className="flex gap-4 p-4 bg-gray-100 h-screen overflow-x-auto">

      {stages.map((stage) => (
        <div
          key={stage}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, stage)}
          className="w-64 bg-white rounded-xl p-3 shadow"
        >
          <h2 className="font-semibold mb-2">{stage}</h2>

          {deals
            .filter((d) => d.stage === stage)
            .map((deal) => (
              <div
                key={deal.id}
                draggable
                onDragStart={(e) => onDragStart(e, deal.id)}
                className="bg-gray-50 p-3 mb-2 rounded-lg shadow cursor-move"
              >
                <p className="font-medium">{deal.name}</p>
                <p className="text-sm text-gray-500">₹{deal.value}</p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}