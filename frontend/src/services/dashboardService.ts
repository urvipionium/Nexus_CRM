// frontend/src/services/dashboardService.ts

import axios from "axios";

export const getDashboardSummary = async () => {
  const response = await axios.get("http://localhost:8000/dashboard/summary");

  return response.data;
};
