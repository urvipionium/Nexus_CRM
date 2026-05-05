import { useState } from "react";

function DealDrawer({ deal, onClose }: any) {
  const [messages, setMessages] = useState([
    { text: "Hello, interested in your service", from: "client" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    setMessages([...messages, { text: input, from: "user" }]);
    setInput("");
  };

  return (
    <div className="w-[400px] bg-white shadow-xl border-l flex flex-col">
      <div className="p-4 border-b flex justify-between">
        <h2 className="font-bold">{deal.title}</h2>
        <button onClick={onClose}>❌</button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.from === "user"
                ? "bg-green-500 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1 rounded-lg"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default DealDrawer;