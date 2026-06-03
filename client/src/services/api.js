import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

export const getTasks = (params = {}) => api.get("/tasks", { params });

export const createTask = (data) => api.post("/tasks", data);

export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);

export const toggleTask = (id) => api.put(`/tasks/${id}/toggle`);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
