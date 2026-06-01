import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";

import Deals from "./pages/Deals/Deals";
import Leads from "./pages/Leads";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import WhatsAppModule from "./pages/WhatsApp/WhatsAppModule";
import Reports from "./pages/Reports/Reports";
import Login from "./pages/login/Login";
import Signup from "./pages/Signup/Signup";

import { LeadsProvider } from "./hooks/useLeads";

function Dashboard() {
  return <DashboardLayout />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route
          path="leads"
          element={
            <LeadsProvider>
              <Leads />
            </LeadsProvider>
          }
        />

        <Route path="deals" element={<Deals />} />
        <Route path="whatsapp" element={<WhatsAppModule />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
