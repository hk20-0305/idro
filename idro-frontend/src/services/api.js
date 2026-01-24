import axios from "axios";

// Backend base URL
const API_URL = "http://localhost:8085/api";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const idroApi = {
  // -------- AUTH ----------
  login: (data) => api.post("/login", data),

  analyzeDisaster: (data) => api.post("/ai/analyze", data),


  // -------- ALERTS ----------
  getAlerts: () => api.get("/alerts"),
getNasaFires: () => api.get("/nasa/fires"),
  getAlertById: (id) => api.get(`/alerts/${id}`),
  submitReport: (data) => api.post("/alerts", data),
  updateReport: (id, data) => api.put(`/alerts/${id}`, data),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),


  // -------- ANALYTICS ----------
  getImpact: (id) => api.get(`/analytics/impact/${id}`),
  getStats: () => api.get("/analytics/stats"),

// -------- CAMPS ----------
getCamps: () => api.get("/api/mission/camps"),
getCampsByAlert: (alertId) => api.get(`/camps/by-alert/${alertId}`),
createCamp: (data) => api.post("/camps", data),


  // -------- ACTIONS ----------
  getActions: () => api.get("/actions"),
  createAction: (data) => api.post("/actions", data),
  getHighPriorityActions: () => api.get("/actions/priority/high"),
  getActionsByRole: (role) => api.get(`/actions/role/${role}`),

  // -------- NASA ----------
  getNasaFires: () => api.get("/nasa/fires"),
};

export default api;
