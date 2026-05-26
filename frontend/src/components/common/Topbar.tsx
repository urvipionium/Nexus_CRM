import Sidebar from "./Sidebar";
import Topbar from "./Topbar.tsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 Topbar (THIS MUST BE HERE) */}
        <Topbar />

        {/* Page Content */}
        <div className="bg-gray-100 min-h-screen">
          <Outlet />
        </div>

      </div>

    </div>
  );
}