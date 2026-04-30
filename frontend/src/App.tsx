function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-2xl font-bold">
        Nexus CRM - PioniumTech
      </header>

      <div className="flex">
        <aside className="w-64 bg-white h-screen shadow-md p-5">
          <ul className="space-y-4 font-medium">
            <li>Dashboard</li>
            <li>Leads</li>
            <li>Clients</li>
            <li>Employees</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow">
              Total Leads: 120
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              Clients: 45
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              Revenue: ₹2.5L
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
