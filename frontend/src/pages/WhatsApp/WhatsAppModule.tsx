import { useRef, useState } from "react";
import {
  Search,
  Send,
  Phone,
  MoreVertical,
  Bot,
  Paperclip,
  Smile,
} from "lucide-react";

type ChatMessage = {
  sender: "client" | "me";
  type: "text" | "image";
  text?: string;
  imageUrl?: string;
  time: string;
};

export default function WhatsAppModule() {

  // =========================
  // CONTACTS
  // =========================

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Rahul Patel",
      company: "RM Consultancy",
      unread: 2,
      lastMessage: "Need quotation today",
      online: true,
    },

    {
      id: 2,
      name: "Amit Shah",
      company: "TechSoft",
      unread: 0,
      lastMessage: "Let's schedule meeting",
      online: false,
    },
  ]);

  // =========================
  // SELECTED CHAT
  // =========================

  const [selectedChat, setSelectedChat] =
    useState<any>(contacts[0]);

  // =========================
  // MESSAGE INPUT
  // =========================

  const [message, setMessage] =
    useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // CHAT DATA
  // =========================

  const [messagesByChat, setMessagesByChat] =
    useState<Record<number, ChatMessage[]>>({
      1: [
        {
          sender: "client",
          type: "text",
          text: "Hello, I need quotation for 200 bottles.",
          time: "10:30 AM",
        },
        {
          sender: "me",
          type: "text",
          text: "Sure sir, please share product details.",
          time: "10:32 AM",
        },
      ],
      2: [
        {
          sender: "client",
          type: "text",
          text: "Do you have the green variant available?",
          time: "11:15 AM",
        },
      ],
    });

  const messages = messagesByChat[selectedChat.id] || [];

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      sender: "me",
      type: "text",
      text: message.trim(),
      time: "Now",
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [selectedChat.id]: [
        ...(prev[selectedChat.id] || []),
        newMessage,
      ],
    }));

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === selectedChat.id
          ? { ...contact, lastMessage: message.trim() }
          : contact
      )
    );

    setMessage("");
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const newMessage: ChatMessage = {
      sender: "me",
      type: "image",
      imageUrl,
      time: "Now",
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [selectedChat.id]: [
        ...(prev[selectedChat.id] || []),
        newMessage,
      ],
    }));

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === selectedChat.id
          ? { ...contact, lastMessage: "Image attached" }
          : contact
      )
    );

    event.target.value = "";
  };

  // =========================
  // AI QUICK REPLIES
  // =========================

  const aiReplies = [
    "Thank you for your inquiry.",
    "Please share your requirement.",
    "I will send quotation shortly.",
    "Can we schedule a call?",
  ];

  return (
    <div className="h-screen flex bg-[#F4F7FE] overflow-hidden">

      {/* =========================
          CONTACT LIST
      ========================= */}

      <div className="w-[360px] bg-white border-r flex flex-col">

        {/* HEADER */}
        <div className="h-20 border-b flex items-center justify-between px-5">

          <div>

            <h1 className="text-2xl font-bold text-gray-800">
              WhatsApp
            </h1>

            <p className="text-sm text-gray-500">
              CRM Conversations
            </p>

          </div>

          <button className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">
            <MoreVertical size={18} />
          </button>

        </div>

        {/* SEARCH */}
        <div className="p-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-gray-100 rounded-2xl pl-10 pr-4 py-3 outline-none"
            />

          </div>

        </div>

        {/* CONTACTS */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">

          {contacts.map((contact) => (

            <div
              key={contact.id}
              onClick={() =>
                setSelectedChat(contact)
              }
              className={`p-4 rounded-3xl cursor-pointer transition-all ${
                selectedChat.id === contact.id
                  ? "bg-blue-50 border border-blue-100"
                  : "bg-white hover:bg-gray-50"
              }`}
            >

              <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="relative">

                  <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                    {contact.name[0]}
                  </div>

                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}

                </div>

                {/* INFO */}
                <div className="flex-1">

                  <div className="flex justify-between">

                    <h2 className="font-semibold text-gray-800">
                      {contact.name}
                    </h2>

                    <span className="text-xs text-gray-400">
                      10:45
                    </span>

                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {contact.lastMessage}
                  </p>

                </div>

                {/* UNREAD */}
                {contact.unread > 0 && (

                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    {contact.unread}
                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* =========================
          CHAT SECTION
      ========================= */}

      <div className="flex-1 flex flex-col">

        {/* CHAT HEADER */}
        <div className="h-20 bg-white border-b flex items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {selectedChat.name[0]}
            </div>

            <div>

              <h2 className="font-bold text-lg">
                {selectedChat.name}
              </h2>

              <p className="text-sm text-green-500">
                Online
              </p>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">

            <button className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">

              <Phone size={18} />

            </button>

            <button className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">

              <MoreVertical size={18} />

            </button>

          </div>

        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#E5DDD5]">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.sender === "me"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[400px] rounded-3xl px-5 py-4 shadow-sm ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.type === "image" ? (
                  <img
                    src={msg.imageUrl}
                    alt="attachment"
                    className="rounded-3xl max-w-full max-h-96 object-cover"
                  />
                ) : (
                  <p>{msg.text}</p>
                )}

                <p
                  className={`text-xs mt-2 ${
                    msg.sender === "me"
                      ? "text-blue-100"
                      : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* AI SUGGESTIONS */}
        <div className="bg-white border-t p-4">

          <div className="flex items-center gap-2 mb-3">

            <Bot
              size={18}
              className="text-blue-500"
            />

            <h2 className="font-semibold text-gray-700">
              AI Suggestions
            </h2>

          </div>

          <div className="flex gap-3 flex-wrap">

            {aiReplies.map((reply, index) => (

              <button
                key={index}
                onClick={() =>
                  setMessage(reply)
                }
                className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm"
              >
                {reply}
              </button>

            ))}

          </div>

        </div>

        {/* MESSAGE BOX */}
        <div className="bg-white border-t p-4 flex items-center gap-3">

          {/* ATTACH */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <button
            type="button"
            onClick={openFilePicker}
            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center"
          >

            <Paperclip size={18} />

          </button>

          {/* EMOJI */}
          <button className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">

            <Smile size={18} />

          </button>

          {/* INPUT */}
          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-2xl px-5 py-4 outline-none"
          />

          {/* SEND */}
          <button
            type="button"
            onClick={sendMessage}
            className="w-14 h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg"
          >

            <Send size={20} />

          </button>

        </div>

      </div>

      {/* =========================
          RIGHT PANEL
      ========================= */}

      <div className="w-[360px] bg-white border-l flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Lead Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            CRM Information
          </p>

        </div>

        {/* DETAILS */}
        <div className="flex-1 p-5 space-y-4">

          <div className="bg-gray-50 rounded-3xl p-5">

            <p className="text-sm text-gray-500">
              Name
            </p>

            <h2 className="font-semibold mt-2">
              {selectedChat.name}
            </h2>

          </div>

          <div className="bg-gray-50 rounded-3xl p-5">

            <p className="text-sm text-gray-500">
              Company
            </p>

            <h2 className="font-semibold mt-2">
              {selectedChat.company}
            </h2>

          </div>

          <div className="bg-gray-50 rounded-3xl p-5">

            <p className="text-sm text-gray-500">
              Status
            </p>

            <h2 className="font-semibold mt-2 text-green-500">
              Interested
            </h2>

          </div>

          <div className="bg-blue-50 rounded-3xl p-5">

            <div className="flex items-center gap-2">

              <Bot
                size={18}
                className="text-blue-500"
              />

              <h2 className="font-semibold">
                AI Analysis
              </h2>

            </div>

            <p className="text-sm text-gray-600 mt-3 leading-6">

              Client is highly interested.
              Probability to close deal is
              around 80%.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}