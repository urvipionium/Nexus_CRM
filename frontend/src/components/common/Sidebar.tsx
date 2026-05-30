import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: "" },
    { name: "Leads", path: "/leads", icon: "" },
    { name: "Deals", path: "/deals", icon: "" },
    { name: "WhatsApp", path: "/whatsapp", icon: "" },
    { name: "Reports", path: "/reports", icon: "" },
    { name: "Login", path: "/login", icon: "" },
    { name: "Signup", path: "/signup", icon: "" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col p-4">
      <h1 className="text-xl font-bold text-blue-600 mb-6">Nexus CRM</h1>

      <div className="flex flex-col gap-2">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto p-3 border-t">
        <p className="text-sm text-gray-500">Logged in as</p>
        <p className="font-semibold">HARSH</p>
      </div>
    </div>
  );
}

export default Sidebar;