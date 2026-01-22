import axios from 'axios';

// Ensure this matches your running backend port (8085 as per your last log)
const API_URL = "http://localhost:8085/api"; 

export const idroApi = {
    getAlerts: () => axios.get(`${API_URL}/alerts`),
    submitReport: (data) => axios.post(`${API_URL}/alerts`, data),
    getImpact: (id) => axios.get(`${API_URL}/analytics/impact/${id}`),
    getStats: () => axios.get(`${API_URL}/analytics/stats`),
    login: (credentials) => axios.post(`${API_URL}/login`, credentials),
    
    // ✅ NEW DELETE FUNCTION
    deleteAlert: (id) => axios.delete(`${API_URL}/alerts/${id}`) 
};