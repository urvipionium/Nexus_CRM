import { useState } from "react";

export default function CreateLeadModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "Manual",
    status: "New",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">

      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Create Lead</h2>

        <input
          placeholder="Name"
          className="w-full p-2 border mb-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="w-full p-2 border mb-2 rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          className="w-full p-2 border mb-4 rounded"
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          <option>Manual</option>
          <option>WhatsApp</option>
          <option>Website</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 