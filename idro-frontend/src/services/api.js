import axios from 'axios';

// Ensure this matches your Spring Boot Port (usually 8080)
const API_URL = 'http://localhost:8085/api';

export const idroApi = {
    // --- ALERTS (DISASTERS) ---
    getAlerts: () => axios.get(`${API_URL}/alerts`),
    
    createAlert: (alertData) => axios.post(`${API_URL}/alerts`, alertData),
    
    deleteAlert: (id) => axios.delete(`${API_URL}/alerts/${id}`),
    
    // The "AI Allocation" Logic - Locks a task for a specific team
    assignMission: (id, responderName) => 
        axios.put(`${API_URL}/alerts/${id}/assign`, null, { params: { responderName } }),

    // --- CAMPS (Optional, if you use them) ---
    getCamps: () => axios.get(`${API_URL}/camps`),
    
    // --- MESSAGES (Broadcast Chat) ---
    getMessages: () => axios.get(`${API_URL}/messages`),
    
    sendMessage: (msgData) => axios.post(`${API_URL}/messages`, msgData),
    
    deleteMessage: (id) => axios.delete(`${API_URL}/messages/${id}`)
};