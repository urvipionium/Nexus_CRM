import { useState } from "react";

import DashboardCards from "./DashboardCards";
import SalesChart from "./SalesChart";
import PipelineSummary from "./PipelineSummary";
import ActivityPanel from "./ActivityPanel";
import RecentDeals from "./RecentDeals";

import WidgetSelectorModal from "./WidgetSelectorModal";
import DashboardWidget from "./DashboardWidget";

export default function DashboardLayout() {

  const [showModal, setShowModal] = useState(false);

  const [widgets, setWidgets] = useState<string[]>([]);

  const addWidget = (widget: string) => {

    setWidgets([...widgets, widget]);

    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          + Add Widget
        </button>

      </div>

      {/* 📊 KPI CARDS */}
      <DashboardCards />

      {/* 📈 CHART + PIPELINE */}
      <div className="grid grid-cols-2 gap-4">

        {/* SALES CHART */}
        <SalesChart />

        {/* PIPELINE */}
        <PipelineSummary />

      </div>

      {/* 📋 TABLE + ACTIVITY */}
      <div className="grid grid-cols-2 gap-4">

        {/* TABLE */}
        <RecentDeals />

        {/* ACTIVITY */}
        <ActivityPanel />

      </div>

      {/* 🚀 USER ADDED WIDGETS */}
      <div className="grid grid-cols-2 gap-4">

        {widgets.map((widget, index) => (
          <DashboardWidget
            key={index}
            type={widget}
          />
        ))}

      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <WidgetSelectorModal onAdd={addWidget} />
      )}

    </div>
  );
}