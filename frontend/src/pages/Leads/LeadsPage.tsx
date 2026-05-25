import { useState } from "react";
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  MoreVertical,
  X,
} from "lucide-react";

const stages = [
  "New",
  "Contacted",
  "Qualified",
  "Won",
];

export default function LeadsPage() {
  // =========================
  // STATES
  // =========================

  const [showModal, setShowModal] =
    useState(false);

  const [selectedLead, setSelectedLead] =
    useState<any>(null);

  const [search, setSearch] =
    useState("");

  const [newLead, setNewLead] =
    useState({
      name: "",
      company: "",
      phone: "",
      value: "",
      stage: "New",
    });

  const [leads, setLeads] =
    useState([
      {
        id: 1,
        name: "Rahul Deal",
        company: "RM Consultancy",
        phone: "+91 9876543210",
        stage: "New",
        value: 20000,
        owner: "Harsh",
        probability: 70,
        aging: 5,
      },
    ]);

  // =========================
  // SEARCH
  // =========================

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // =========================
  // DRAG DROP
  // =========================

  const onDragStart = (
    e: any,
    id: number
  ) => {
    e.dataTransfer.setData("id", id);
  };

  const onDrop = (
    e: any,
    stage: string
  ) => {
    const id =
      e.dataTransfer.getData("id");

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id == id
          ? { ...lead, stage }
          : lead
      )
    );
  };

  // =========================
  // CREATE LEAD
  // =========================

  const handleCreateLead = () => {
    if (
      !newLead.name ||
      !newLead.phone
    )
      return;

    const lead = {
      id: Date.now(),
      name: newLead.name,
      company: newLead.company,
      phone: newLead.phone,
      value: Number(newLead.value),
      stage: newLead.stage,
      owner: "Harsh",
      probability: 25,
      aging: 0,
    };

    setLeads([...leads, lead]);

    setShowModal(false);

    setNewLead({
      name: "",
      company: "",
      phone: "",
      value: "",
      stage: "New",
    });
  };

  return (
    <div className="h-screen bg-[#F4F7FE] flex flex-col overflow-hidden">

      {/* =========================
          TOPBAR
      ========================= */}

      <div className="h-20 bg-white border-b flex items-center justify-between px-6">

        {/* LEFT */}
        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Leads Pipeline
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage all incoming leads
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              type="text"
              placeholder="Search Leads..."
              className="pl-10 pr-4 py-3 rounded-2xl bg-gray-100 outline-none w-[280px]"
            />

          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2"
          >

            <Plus size={18} />

            Add Lead

          </button>

        </div>

      </div>

      {/* =========================
          KANBAN BOARD
      ========================= */}

      <div className="flex gap-6 p-6 overflow-x-auto flex-1">

        {stages.map((stage) => (

          <div
            key={stage}
            onDragOver={(e) =>
              e.preventDefault()
            }
            onDrop={(e) =>
              onDrop(e, stage)
            }
            className="min-w-[350px] bg-[#EEF2FF] rounded-3xl p-5"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="font-bold text-xl">
                  {stage}
                </h2>

                <p className="text-sm text-gray-500">
                  {
                    filteredLeads.filter(
                      (l) =>
                        l.stage === stage
                    ).length
                  }{" "}
                  Leads
                </p>

              </div>

              <button className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center">

                <Plus size={18} />

              </button>

            </div>

            {/* CARDS */}
            <div className="space-y-4">

              {filteredLeads
                .filter(
                  (lead) =>
                    lead.stage === stage
                )
                .map((lead) => (

                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) =>
                      onDragStart(
                        e,
                        lead.id
                      )
                    }
                    onClick={() =>
                      setSelectedLead(
                        lead
                      )
                    }
                    className="bg-white rounded-3xl p-5 shadow-sm cursor-pointer hover:shadow-xl transition-all"
                  >

                    {/* TOP */}
                    <div className="flex justify-between">

                      <div>

                        <h2 className="font-bold text-lg text-gray-800">
                          {lead.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          {
                            lead.company
                          }
                        </p>

                      </div>

                      <button>
                        <MoreVertical
                          size={18}
                        />
                      </button>

                    </div>

                    {/* VALUE */}
                    <div className="mt-5">

                      <h2 className="text-4xl font-bold text-gray-800">
                        ₹{lead.value}
                      </h2>

                    </div>

                    {/* PROGRESS */}
                    <div className="mt-5">

                      <div className="flex justify-between text-sm mb-2">

                        <span className="text-gray-500">
                          Probability
                        </span>

                        <span>
                          {
                            lead.probability
                          }
                          %
                        </span>

                      </div>

                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{
                            width: `${lead.probability}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* OWNER */}
                    <div className="flex justify-between items-center mt-6">

                      <div>

                        <p className="text-xs text-gray-400">
                          Owner
                        </p>

                        <h3 className="font-semibold">
                          {
                            lead.owner
                          }
                        </h3>

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Aging
                        </p>

                        <h3 className="font-bold text-orange-500">
                          {
                            lead.aging
                          }{" "}
                          Days
                        </h3>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="grid grid-cols-2 gap-3 mt-6">

                      <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2">

                        <MessageCircle
                          size={16}
                        />

                        WhatsApp

                      </button>

                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2">

                        <Phone
                          size={16}
                        />

                        Call

                      </button>

                    </div>

                  </div>

                ))}

            </div>

          </div>

        ))}

      </div>

      {/* =========================
          RIGHT DRAWER
      ========================= */}

      {selectedLead && (

        <div className="fixed right-0 top-0 w-[420px] h-full bg-white border-l shadow-xl flex flex-col z-50">

          {/* HEADER */}
          <div className="p-6 border-b flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
                {
                  selectedLead.name
                }
              </h2>

              <p className="text-gray-500 mt-1">
                {
                  selectedLead.company
                }
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedLead(null)
              }
            >
              <X size={24} />
            </button>

          </div>

          {/* CONTENT */}
          <div className="flex-1 p-5 space-y-4">

            <div className="bg-blue-50 rounded-3xl p-5">

              <p className="text-sm text-gray-500">
                AI Suggestion
              </p>

              <h2 className="font-semibold mt-2">
                High probability lead.
                Follow up today.
              </h2>

            </div>

            <div className="bg-gray-50 rounded-3xl p-5">

              <p className="text-sm text-gray-500">
                Phone Number
              </p>

              <h2 className="font-semibold mt-2">
                {
                  selectedLead.phone
                }
              </h2>

            </div>

            <div className="bg-gray-50 rounded-3xl p-5">

              <p className="text-sm text-gray-500">
                Lead Value
              </p>

              <h2 className="font-semibold mt-2">
                ₹
                {
                  selectedLead.value
                }
              </h2>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          CREATE LEAD MODAL
      ========================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-3xl p-6 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Create New Lead
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add lead details
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-2xl text-gray-400"
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <div className="space-y-4">

              <input
                type="text"
                placeholder="Lead Name"
                value={newLead.name}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    name:
                      e.target.value,
                  })
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="Company"
                value={newLead.company}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    company:
                      e.target.value,
                  })
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    phone:
                      e.target.value,
                  })
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <input
                type="number"
                placeholder="Lead Value"
                value={newLead.value}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    value:
                      e.target.value,
                  })
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <select
                value={newLead.stage}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    stage:
                      e.target.value,
                  })
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              >

                {stages.map((stage) => (

                  <option
                    key={stage}
                    value={stage}
                  >
                    {stage}
                  </option>

                ))}

              </select>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-8">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="flex-1 border py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleCreateLead
                }
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl"
              >
                Create Lead
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}