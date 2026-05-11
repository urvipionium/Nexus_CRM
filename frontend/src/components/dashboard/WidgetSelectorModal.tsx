import { useState } from "react";

type Props = {
  onAdd: (widget: string) => void;
};

export default function WidgetSelectorModal({
  onAdd
}: Props) {

  const [componentName, setComponentName] =
    useState("");

  const [widgetType, setWidgetType] =
    useState("SalesChart");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Create Widget
          </h1>

        </div>

        {/* BODY */}
        <div className="grid grid-cols-2 gap-10">

          {/* LEFT PREVIEW */}
          <div className="border rounded-2xl p-6 bg-gray-50">

            <h2 className="text-sm text-gray-500 mb-2">
              Preview
            </h2>

            <div className="bg-white shadow rounded-2xl p-6">

              <p className="text-gray-500 text-sm">
                COMPONENT NAME
              </p>

              <h2 className="text-4xl font-bold mt-3">
                ₹4,20,000
              </h2>

              <p className="text-green-500 mt-2">
                +3.2%
              </p>

            </div>

          </div>

          {/* RIGHT FORM */}
          <div className="space-y-6">

            {/* COMPONENT NAME */}
            <div>

              <label className="block mb-2 font-medium">
                Component Name
              </label>

              <input
                type="text"
                value={componentName}
                onChange={(e) =>
                  setComponentName(e.target.value)
                }
                placeholder="Enter component name"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* WIDGET TYPE */}
            <div>

              <label className="block mb-2 font-medium">
                Widget Type
              </label>

              <select
                value={widgetType}
                onChange={(e) =>
                  setWidgetType(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="SalesChart">
                  Sales Chart
                </option>

                <option value="PipelineSummary">
                  Pipeline Summary
                </option>

                <option value="RecentDeals">
                  Recent Deals
                </option>

                <option value="ActivityPanel">
                  Activity Panel
                </option>

              </select>

            </div>

            {/* MODULE */}
            <div>

              <label className="block mb-2 font-medium">
                Module
              </label>

              <select
                className="w-full border rounded-xl px-4 py-3"
              >

                <option>Deals</option>
                <option>Leads</option>
                <option>Contacts</option>

              </select>

            </div>

            {/* DURATION */}
            <div>

              <label className="block mb-2 font-medium">
                Duration
              </label>

              <select
                className="w-full border rounded-xl px-4 py-3"
              >

                <option>This Month</option>
                <option>This Week</option>
                <option>This Year</option>

              </select>

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 pt-6">

              <button
                className="border px-5 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => onAdd(widgetType)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
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