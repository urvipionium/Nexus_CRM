import { useState } from "react";
import DashboardCards from "./DashboardCards";
import SalesChart from "./SalesChart";
import PipelineSummary from "./PipelineSummary";
import ActivityPanel from "./ActivityPanel";
import RecentDeals from "./RecentDeals";
import WidgetSelectorModal from "./WidgetSelectorModal";

type WidgetKey =
  | "SalesChart"
  | "PipelineSummary"
  | "ActivityPanel"
  | "RecentDeals";
interface WidgetInfo {
  title: string;
  component: React.ComponentType<any>;
}
const widgetRegistry: Record<WidgetKey, WidgetInfo> = {
  SalesChart: {
    title: "Sales Chart",
    component: SalesChart,
  },
  PipelineSummary: {
    title: "Pipeline Summary",
    component: PipelineSummary,
  },
  ActivityPanel: {
    title: "Activity Panel",
    component: ActivityPanel,
  },
  RecentDeals: {
    title: "Recent Deals",
    component: RecentDeals,
  },
};

type Condition = {
  field: string;
  operator: string;
  value: string;
};
type WidgetConfig = {
  widgetType: WidgetKey;
  componentName: string;
  conditions: Condition[];
};

export default function DashboardLayout() {
  const [showModal, setShowModal] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    {
      widgetType: "SalesChart",
      componentName: "Sales Chart",
      conditions: [],
    },
    {
      widgetType: "PipelineSummary",
      componentName: "Pipeline Summary",
      conditions: [],
    },
    {
      widgetType: "ActivityPanel",
      componentName: "Activity Panel",
      conditions: [],
    },
    {
      widgetType: "RecentDeals",
      componentName: "Recent Deals",
      conditions: [],
    },
  ]);

  const addWidget = (config: WidgetConfig) => {
    setWidgets([...widgets, config]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-0 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 px-4 md:px-0 pt-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
            CRM Dashboard
          </h1>
          <p className="text-slate-500 text-lg">
            Welcome back! Here’s your business at a glance.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition font-semibold"
        >
          + Add Widget
        </button>
      </div>

      {/* KPI CARDS */}
      <section className="mb-6 px-4 md:px-0">
        <DashboardCards />
      </section>

      {/* WIDGET GRID */}
      <section className="px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {widgets.map((widget, idx) => {
            const WidgetComp = widgetRegistry[widget.widgetType].component;
            const title =
              widget.componentName || widgetRegistry[widget.widgetType].title;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col min-h-[300px] border border-slate-100 hover:shadow-xl transition group"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-slate-700 group-hover:text-indigo-600 transition">
                    {title}
                  </h2>
                  {/* Remove widget button (optional) */}
                  {/* <button className="text-slate-400 hover:text-red-500" onClick={() => removeWidget(idx)}>&times;</button> */}
                </div>
                <div className="flex-1">
                  <WidgetComp conditions={widget.conditions} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Widget Selector Modal */}
      {showModal && <WidgetSelectorModal onAdd={addWidget} />}
    </div>
  );
}
