const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { redirect } from "react-router-dom";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get("csrftoken");

    // Agregamos el header SOLO si el método lo necesita
    const method = config.method?.toUpperCase();
    const safeMethods = ["GET", "HEAD", "OPTIONS"];

    if (!safeMethods.includes(method) && csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page on 401 error
      redirect("/login");
    } else if (!error.response) {
      // Handle connection errors
      console.error("Network error: Unable to connect to the server.");
    }
    return Promise.reject(error); // Reject other errors
  }
);

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/api/auth/register", data);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/api/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/api/auth/logout");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get("/api/users/me");
  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosInstance.post("/api/auth/refresh");
  return response.data;
};

export const getProjects = async () => {
  const response = await axiosInstance.get("/api/projects");
  return response.data;
};

export const getProjectDetail = async (projectId) => {
  const response = await axiosInstance.get(`/api/projects/${projectId}`);
  return response.data;
};

export const createProject = async (data) => {
  const response = await axiosInstance.post("/api/projects/", data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await axiosInstance.put(`/api/projects/${id}`, data);
  return response.data;
};

export const getTaskTemplates = async () => {
  const response = await axiosInstance.get("/api/templates");
  return response.data;
};

export const getTask = async ({ projectId, taskId }) => {
  const url = `/api/projects/${projectId}/tasks/${taskId}/`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const createTask = async ({ data, projectId }) => {
  const url = `/api/projects/${projectId}/tasks/`;
  const response = await axiosInstance.post(url, data);
  return response.data;
};

export const updateTask = async ({ projectId, taskId, data }) => {
  const url = `/api/projects/${projectId}/tasks/${taskId}/`;
  const response = await axiosInstance.patch(url, data);
  return response.data;
};

export const updateTaskStatus = async ({ projectId, taskId, statusId }) => {
  const response = await axiosInstance.post(
    `/api/projects/${projectId}/tasks/${taskId}/move/`,
    { status: statusId }
  );
  return response.data;
};

export const deleteTask = async ({ projectId, taskId }) => {
  await axiosInstance.delete(`/api/projects/${projectId}/tasks/${taskId}/`);
  return { success: true };
};

export const getStatuses = async () => {
  const response = await axiosInstance.get("/api/statuses");
  return response.data;
};
