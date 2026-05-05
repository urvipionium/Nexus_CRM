import { useState } from "react";


function CreateDealModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({
    title: "",
    value: "",
    days: ""
  });

  const handleSubmit = () => {
    if (!form.title || !form.value) return;

    const newDeal = {
      id: Date.now().toString(),
      title: form.title,
      value: Number(form.value),
      days: Number(form.days || 1)
    };

    onSave(newDeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      
      <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl">
        <h2 className="text-lg font-bold mb-4">Create Deal</h2>

        <input
          placeholder="Deal Title"
          className="w-full border p-2 rounded mb-3"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Deal Value"
          type="number"
          className="w-full border p-2 rounded mb-3"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <input
          placeholder="Follow-up Days"
          type="number"
          className="w-full border p-2 rounded mb-4"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
          >
            Save
          </button>
        </div>
      </div>

    </div>
  );
}

export default CreateDealModal;