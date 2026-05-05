import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

type Deal = {
  id: string;
  title: string;
  value: number;
  days: number;
};

type PipelineData = {
  New: Deal[];
  Proposal: Deal[];
  Negotiation: Deal[];
  Closed: Deal[];
};

const initialData: PipelineData = {
  New: [{ id: "1", title: "Website", value: 50000, days: 2 }],
  Proposal: [{ id: "2", title: "Mobile App", value: 120000, days: 5 }],
  Negotiation: [],
  Closed: []
};

export default function Deals() {
  const [data, setData] = useState<PipelineData>(initialData);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showModal, setShowModal] = useState(false);

  const allDeals = Object.values(data).flat();

  const pipelineValue = allDeals.reduce((s: any, d: any) => s + d.value, 0);
  const avgAging =
    allDeals.length > 0
      ? Math.round(allDeals.reduce((s: any, d: any) => s + d.days, 0) / allDeals.length)
      : 0;

  const conversionRate =
    allDeals.length > 0
      ? Math.round((data.Closed.length / allDeals.length) * 100)
      : 0;

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const source = result.source.droppableId;
    const dest = result.destination.droppableId;

    const sourceItems = [...(data[source] || [])];
    const destItems = [...(data[dest] || [])];

    const [moved] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, moved);

    setData({
      ...data,
      [source]: sourceItems,
      [dest]: destItems
    });
  };

  return (
    <div className="flex h-screen">

      {/* 🚀 MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Deals Pipeline</h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            + Create Deal
          </button>
        </div>

        {/* 📊 STATS */}
        <div className="px-4 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Pipeline Value</p>
            <h2 className="text-xl font-bold">₹{pipelineValue}</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Deal Aging</p>
            <h2 className="text-xl font-bold">{avgAging} days</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Conversion</p>
            <h2 className="text-xl font-bold">{conversionRate}%</h2>
          </div>
        </div>

        {/* 🔁 KANBAN */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 p-6 overflow-x-auto">

            {Object.keys(data).map((col) => (
              <Droppable droppableId={col} key={col}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[260px] bg-white rounded-2xl shadow-sm p-4"
                  >
                    <h2 className="mb-3 font-semibold flex justify-between">
                      {col}
                      <span className="text-gray-400 text-sm">
                        {data[col].length}
                      </span>
                    </h2>

                    {data[col].map((deal: any, index: number) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setSelectedDeal(deal)}
                            className="bg-gray-50 p-4 rounded-xl shadow mb-3 cursor-pointer hover:shadow-md transition"
                          >
                            <h3 className="font-semibold">{deal.title}</h3>
                            <p className="text-sm text-gray-500">₹{deal.value}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {deal.days} days
                            </p>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}

          </div>
        </DragDropContext>
      </div>

      {/* 👉 RIGHT PANEL */}
      <div className="w-[340px] bg-white border-l p-4">
        {selectedDeal ? (
          <>
            <h2 className="text-lg font-bold">{selectedDeal.title}</h2>
            <p className="text-gray-500">₹{selectedDeal.value}</p>

            <div className="mt-4 space-y-2">
              <button className="w-full bg-blue-500 text-white py-2 rounded-xl">
                📞 Call
              </button>
              <button className="w-full bg-green-500 text-white py-2 rounded-xl">
                💬 WhatsApp
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Select a deal</p>
        )}
      </div>

    </div>
  );
}