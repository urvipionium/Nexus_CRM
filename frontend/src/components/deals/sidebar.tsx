function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: "📊" },
    { name: "Leads", icon: "👥" },
    { name: "Deals", icon: "💼" },
    { name: "WhatsApp", icon: "💬" },
    { name: "Reports", icon: "📈" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col p-4">
      
      {/* LOGO */}
      <h1 className="text-xl font-bold text-blue-600 mb-6">
        🚀 CRM
      </h1>

      {/* MENU */}
      <div className="flex flex-col gap-2">
        {menu.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
              ${
                item.name === "Deals"
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* BOTTOM USER */}
      <div className="mt-auto p-3 border-t">
        <p className="text-sm text-gray-500">Logged in as</p>
        <p className="font-semibold">Dhairya</p>
      </div>
    </div>
  );
}

export default Sidebar;