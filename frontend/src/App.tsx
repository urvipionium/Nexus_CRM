import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";

import Deals from "./pages/Deals/Deals";
import DashboardLayout from "./components/dashboard/DashboardLayout";

function Dashboard() {
  return <DashboardLayout />;
}

function Leads() {
  return <h1 className="p-6 text-xl">Leads Page</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="deals" element={<Deals />} />
      </Route>
    </Routes>
  );
}

export default App;