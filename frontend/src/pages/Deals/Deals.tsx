import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

type CustomField = {
  id: number;
  label: string;
  type: string;
};

type Deal = {
  id: string;
  title: string;
  value: number;
  createdAt: string;
};

type PipelineData = {
  [key: string]: Deal[];
};

const initialData: PipelineData = {
  New: [
    {
      id: "1",
      title: "Website",
      value: 50000,
      createdAt: "2026-05-16"
    }
  ],

  Proposal: [
    {
      id: "2",
      title: "Mobile App",
      value: 120000,
      createdAt: "2026-05-13"
    }
  ],

  Negotiation: [],
  Closed: []
};

export default function Deals() {
  const [data, setData] =
    useState<PipelineData>(initialData);

  const [selectedDeal, setSelectedDeal] =
    useState<Deal | null>(null);

  // 🔥 DEAL MODAL
  const [showModal, setShowModal] =
    useState(false);

  // 🔥 CUSTOM FIELD MODAL
  const [
    showCustomFieldModal,
    setShowCustomFieldModal
  ] = useState(false);

  // 🔥 STAGE MODAL
  const [showStageModal, setShowStageModal] =
    useState(false);

  // 🔥 NEW STAGE
  const [newStage, setNewStage] =
    useState("");

  // 🔥 DEAL FORM
  const [newDeal, setNewDeal] = useState({
    title: "",
    value: "",
    stage: "New"
  });

  // 🔥 CUSTOM FIELD FORM
  const [customField, setCustomField] =
    useState({
      label: "",
      type: "text"
    });

  // 🔥 CUSTOM FIELDS
  const [customFields, setCustomFields] =
    useState<CustomField[]>([]);

  // 🔥 DEAL AGING
  const getDealAge = (createdAt: string) => {
    const createdDate = new Date(createdAt);

    const today = new Date();

    const diffTime =
      today.getTime() - createdDate.getTime();

    return Math.floor(
      diffTime / (1000 * 60 * 60 * 24)
    );
  };

  // 📊 ALL DEALS
  const allDeals = Object.values(data).flat();

  // 💰 PIPELINE VALUE
  const pipelineValue = allDeals.reduce(
    (s: number, d: Deal) => s + d.value,
    0
  );

  // ⏳ AVG AGING
  const avgAging =
    allDeals.length > 0
      ? Math.round(
          allDeals.reduce(
            (s: number, d: Deal) =>
              s + getDealAge(d.createdAt),
            0
          ) / allDeals.length
        )
      : 0;

  // 📈 CONVERSION
  const conversionRate =
    allDeals.length > 0
      ? Math.round(
          ((data["Closed"]?.length || 0) /
            allDeals.length) *
            100
        )
      : 0;

  // 🔁 DRAG DROP
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const source =
      result.source.droppableId;

    const dest =
      result.destination.droppableId;

    const sourceItems = [...data[source]];
    const destItems = [...data[dest]];

    const [moved] = sourceItems.splice(
      result.source.index,
      1
    );

    destItems.splice(
      result.destination.index,
      0,
      moved
    );

    setData({
      ...data,
      [source]: sourceItems,
      [dest]: destItems
    });
  };

  // 🔥 CREATE DEAL
  const handleCreateDeal = () => {
    if (!newDeal.title || !newDeal.value)
      return;

    const deal: Deal = {
      id: Date.now().toString(),
      title: newDeal.title,
      value: Number(newDeal.value),
      createdAt: new Date().toISOString()
    };

    setData({
      ...data,
      [newDeal.stage]: [
        ...data[newDeal.stage],
        deal
      ]
    });

    setNewDeal({
      title: "",
      value: "",
      stage: "New"
    });

    setShowModal(false);
  };

  // 🔥 ADD STAGE
  const handleAddStage = () => {
    if (!newStage) return;

    setData({
      ...data,
      [newStage]: []
    });

    setNewDeal({
      ...newDeal,
      stage: newStage
    });

    setNewStage("");

    setShowStageModal(false);
  };

  // 🔥 ADD CUSTOM FIELD
  const handleAddCustomField = () => {
    if (!customField.label) return;

    setCustomFields([
      ...customFields,
      {
        id: Date.now(),
        label: customField.label,
        type: customField.type
      }
    ]);

    setCustomField({
      label: "",
      type: "text"
    });

    setShowCustomFieldModal(false);
  };

  // 🔥 RENDER FIELD
  const renderCustomFieldInput = (
    field: CustomField
  ) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            className="w-full border rounded-xl px-4 py-3"
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="w-full border rounded-xl px-4 py-3"
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full border rounded-xl px-4 py-3"
          />
        );

      case "textarea":
        return (
          <textarea
            rows={4}
            className="w-full border rounded-xl px-4 py-3"
          />
        );

      case "select":
        return (
          <select className="w-full border rounded-xl px-4 py-3">
            <option>Select Option</option>
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label>{field.label}</label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4">

          <h2 className="text-lg font-semibold">
            Deals Pipeline
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            + Create Deal
          </button>

        </div>

        {/* STATS */}
        <div className="px-4 grid grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Pipeline Value
            </p>

            <h2 className="text-xl font-bold">
              ₹{pipelineValue}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Deal Aging
            </p>

            <h2 className="text-xl font-bold">
              {avgAging} days
            </h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Conversion
            </p>

            <h2 className="text-xl font-bold">
              {conversionRate}%
            </h2>
          </div>

        </div>

        {/* KANBAN */}
        <DragDropContext onDragEnd={onDragEnd}>

          <div className="flex gap-6 p-6 overflow-x-auto">

            {Object.keys(data).map((col) => (
              <Droppable
                droppableId={col}
                key={col}
              >
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

                    {data[col].map(
                      (
                        deal: Deal,
                        index: number
                      ) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id}
                          index={index}
                        >
                          {(provided) => (
                            <motion.div
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              whileHover={{
                                scale: 1.03
                              }}
                              onClick={() =>
                                setSelectedDeal(
                                  deal
                                )
                              }
                              className="bg-gray-50 p-4 rounded-xl shadow mb-3 cursor-pointer"
                            >

                              <h3 className="font-semibold">
                                {deal.title}
                              </h3>

                              <p className="text-sm text-gray-500">
                                ₹{deal.value}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                {getDealAge(
                                  deal.createdAt
                                )}{" "}
                                days
                              </p>

                            </motion.div>
                          )}
                        </Draggable>
                      )
                    )}

                    {provided.placeholder}

                  </div>
                )}
              </Droppable>
            ))}

          </div>

        </DragDropContext>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-[340px] bg-white border-l p-4">

        {selectedDeal ? (
          <>

            <h2 className="text-lg font-bold">
              {selectedDeal.title}
            </h2>

            <p className="text-gray-500">
              ₹{selectedDeal.value}
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Deal Age:{" "}
              {getDealAge(
                selectedDeal.createdAt
              )}{" "}
              days
            </p>

          </>
        ) : (
          <p className="text-gray-400">
            Select a deal
          </p>
        )}

      </div>

      {/* CREATE DEAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Create New Deal
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-2xl text-gray-400"
              >
                ×
              </button>

            </div>

            {/* DEAL NAME */}
            <div className="mb-4">

              <label className="block text-sm font-medium mb-1">
                Deal Name
              </label>

              <input
                type="text"
                value={newDeal.title}
                onChange={(e) =>
                  setNewDeal({
                    ...newDeal,
                    title: e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            {/* DEAL VALUE */}
            <div className="mb-4">

              <label className="block text-sm font-medium mb-1">
                Deal Value
              </label>

              <input
                type="number"
                value={newDeal.value}
                onChange={(e) =>
                  setNewDeal({
                    ...newDeal,
                    value: e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            {/* STAGE */}
            <div className="mb-4">

              <div className="flex justify-between items-center mb-1">

                <label className="text-sm font-medium">
                  Pipeline Stage
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowStageModal(true)
                  }
                  className="text-blue-500 text-sm font-medium hover:text-blue-600"
                >
                  + Add New Stage
                </button>

              </div>

              <select
                value={newDeal.stage}
                onChange={(e) =>
                  setNewDeal({
                    ...newDeal,
                    stage: e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              >

                {Object.keys(data).map(
                  (stage) => (
                    <option
                      key={stage}
                      value={stage}
                    >
                      {stage}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* CUSTOM FIELD SECTION */}
            <div className="pt-4 border-t">

              <div className="flex items-center justify-between mb-4">

                <h3 className="font-semibold text-gray-700">
                  Custom Fields
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setShowCustomFieldModal(
                      true
                    )
                  }
                  className="text-blue-500 text-sm font-medium"
                >
                  + Add Custom Field
                </button>

              </div>

              <div className="space-y-4">

                {customFields.map((field) => (
                  <div key={field.id}>

                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>

                    {renderCustomFieldInput(
                      field
                    )}

                  </div>
                ))}

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-6">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateDeal}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
              >
                Create Deal
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ADD STAGE MODAL */}
      {showStageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70]">

          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-2xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Add New Stage
              </h2>

              <button
                onClick={() =>
                  setShowStageModal(false)
                }
                className="text-2xl text-gray-400"
              >
                ×
              </button>

            </div>

            <div className="mb-6">

              <label className="block text-sm font-medium mb-1">
                Stage Name
              </label>

              <input
                type="text"
                value={newStage}
                onChange={(e) =>
                  setNewStage(e.target.value)
                }
                placeholder="Enter stage name"
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowStageModal(false)
                }
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleAddStage}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
              >
                Add Stage
              </button>

            </div>

          </div>

        </div>
      )}

      {/* CUSTOM FIELD MODAL */}
      {showCustomFieldModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">

          <div className="bg-white w-[420px] rounded-2xl p-6 shadow-2xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Add Custom Field
              </h2>

              <button
                onClick={() =>
                  setShowCustomFieldModal(
                    false
                  )
                }
                className="text-2xl text-gray-400"
              >
                ×
              </button>

            </div>

            <div className="mb-4">

              <label className="block text-sm font-medium mb-1">
                Field Label
              </label>

              <input
                type="text"
                value={customField.label}
                onChange={(e) =>
                  setCustomField({
                    ...customField,
                    label: e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            <div className="mb-6">

              <label className="block text-sm font-medium mb-1">
                Data Type
              </label>

              <select
                value={customField.type}
                onChange={(e) =>
                  setCustomField({
                    ...customField,
                    type: e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              >

                <option value="text">
                  Single Line Text
                </option>

                <option value="number">
                  Number
                </option>

                <option value="date">
                  Date
                </option>

                <option value="textarea">
                  Multi Line Text
                </option>

                <option value="select">
                  Dropdown
                </option>

                <option value="checkbox">
                  Checkbox
                </option>

              </select>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowCustomFieldModal(
                    false
                  )
                }
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleAddCustomField}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
              >
                Add Field
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}




