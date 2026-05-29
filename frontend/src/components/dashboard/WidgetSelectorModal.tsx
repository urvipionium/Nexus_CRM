import { useState } from "react";

type WidgetKey =
  | "SalesChart"
  | "PipelineSummary"
  | "ActivityPanel"
  | "RecentDeals";

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

type Props = {
  onAdd: (config: WidgetConfig) => void;
  onClose?: () => void; // optional — works with or without parent passing it
};

export default function WidgetSelectorModal({ onAdd, onClose }: Props) {
  // ── Self-contained visibility state ──────────────────────────────────────
  // The modal manages its own open/close so Cancel always works
  // even if the parent forgets to pass onClose.
  const [isVisible, setIsVisible] = useState(true);

  const [componentName, setComponentName] = useState("");
  const [widgetType, setWidgetType] = useState<WidgetKey>("SalesChart");
  const [conditions, setConditions] = useState<Condition[]>([]);

  const crmFields = [
    { label: "Amount",       value: "amount"      },
    { label: "Stage",        value: "stage"       },
    { label: "Owner",        value: "owner"       },
    { label: "Status",       value: "status"      },
    { label: "Created Date", value: "createdDate" },
    { label: "Source",       value: "source"      },
    { label: "Probability",  value: "probability" },
  ];

  const operators = [
    { label: "Equals",       value: "=="         },
    { label: "Not Equals",   value: "!="         },
    { label: "Greater Than", value: ">"          },
    { label: "Less Than",    value: "<"          },
    { label: "Contains",     value: "contains"   },
    { label: "Starts With",  value: "startsWith" },
    { label: "Ends With",    value: "endsWith"   },
  ];

  // ── Close handler — works with or without parent onClose ─────────────────
  const handleClose = () => {
    setIsVisible(false);   // always hides the modal
    if (onClose) onClose(); // also calls parent handler if provided
  };

  const addCondition = () => {
    setConditions([...conditions, { field: "amount", operator: "==", value: "" }]);
  };

  const updateCondition = (idx: number, key: keyof Condition, val: string) => {
    setConditions(conditions.map((c, i) => (i === idx ? { ...c, [key]: val } : c)));
  };

  const removeCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onAdd({ widgetType, componentName, conditions });
    handleClose();
  };

  // ── Don't render if closed ───────────────────────────────────────────────
  if (!isVisible) return null;

  return (
    // Clicking the backdrop also closes the modal
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      {/* Stop clicks inside the modal from closing it */}
      <div
        className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Widget</h1>
            <p className="text-sm text-gray-400 mt-0.5">Configure and preview your dashboard widget</p>
          </div>
          {/* Header × close button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors text-xl leading-none font-light"
          >
            ×
          </button>
        </div>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-10">

          {/* LEFT — PREVIEW */}
          <div className="border rounded-2xl p-6 bg-gray-50 h-fit">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Preview</p>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                {componentName || "Component Name"}
              </p>
              <h2 className="text-4xl font-bold mt-3 text-gray-900">₹4,20,000</h2>
              <p className="text-green-500 font-medium mt-2">↑ +3.2% this month</p>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Widget preview updates as you type
            </p>
          </div>

          {/* RIGHT — FORM */}
          <div className="space-y-5">

            {/* COMPONENT NAME */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                Component Name
              </label>
              <input
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="e.g. Monthly Revenue"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* WIDGET TYPE */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                Widget Type
              </label>
              <select
                value={widgetType}
                onChange={(e) => setWidgetType(e.target.value as WidgetKey)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="SalesChart">Sales Chart</option>
                <option value="PipelineSummary">Pipeline Summary</option>
                <option value="RecentDeals">Recent Deals</option>
                <option value="ActivityPanel">Activity Panel</option>
              </select>
            </div>

            {/* MODULE */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                Module
              </label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option>Deals</option>
                <option>Leads</option>
                <option>Contacts</option>
              </select>
            </div>

            {/* DURATION */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                Duration
              </label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option>This Month</option>
                <option>This Week</option>
                <option>This Year</option>
              </select>
            </div>

            {/* CONDITIONS */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Conditions
              </label>
              <div className="space-y-2">
                {conditions.length === 0 && (
                  <p className="text-xs text-gray-400 py-2">No conditions added yet.</p>
                )}
                {conditions.map((cond, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                      value={cond.field}
                      onChange={(e) => updateCondition(idx, "field", e.target.value)}
                    >
                      {crmFields.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>

                    <select
                      className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                      value={cond.operator}
                      onChange={(e) => updateCondition(idx, "operator", e.target.value)}
                    >
                      {operators.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>

                    <input
                      className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                      value={cond.value}
                      onChange={(e) => updateCondition(idx, "value", e.target.value)}
                      placeholder="Value"
                    />

                    <button
                      type="button"
                      onClick={() => removeCondition(idx)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 flex items-center justify-center transition-colors flex-shrink-0 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCondition}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                >
                  + Add Condition
                </button>
              </div>
            </div>

            {/* ── ACTION BUTTONS ─────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              {/* CANCEL — always works via handleClose */}
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              {/* SAVE */}
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors shadow-sm"
              >
                Save Widget
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
