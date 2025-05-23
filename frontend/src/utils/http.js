const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      const isOnLoginPage = window.location.pathname === "/login";
      if (!isOnLoginPage) {
        // Redirige manualmente al login
        window.location.href = "/login";
      }
      // Redirect to login page on 401 error
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

export const deleteProject = async (id) => {
  await axiosInstance.delete(`/api/projects/${id}/`);
  return { success: true };
};

export const getProjectMembers = async (id) => {
  const response = await axiosInstance.get(`/api/projects/${id}/members`);
  return response.data;
};

export const updateProject = async ({ id, data }) => {
  const response = await axiosInstance.put(`/api/projects/${id}/`, data);
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
  toast.success("Task created successfully");
  return response.data;
};

export const updateTask = async ({ projectId, taskId, data }) => {
  const url = `/api/projects/${projectId}/tasks/${taskId}/`;
  const response = await axiosInstance.patch(url, data);
  return response.data;
};

export const updateTaskStatus = async ({ projectId, taskId, direction }) => {
  const response = await axiosInstance.post(
    `/api/projects/${projectId}/tasks/${taskId}/move/`,
    { direction }
  );
  toast.success("Successfull moved task");
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

export const createTaskTimeLog = async ({ projectId, taskId, data }) => {
  const response = await axiosInstance.post(
    `/api/projects/${projectId}/tasks/${taskId}/add_time/`,
    data
  );
  return response.data;
};
