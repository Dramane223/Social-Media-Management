import axios from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";
import { addToast } from "../store/toastSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
    const notify = (type, message) => store.dispatch(addToast(type, message));

    if (!error.response) {
      notify("error", "Cannot reach the server. Check your connection or try again.");
    } else if (status === 401 && !isAuthCall) {
      // Token expired or invalid: clear session; ProtectedRoute redirects to /login
      if (store.getState().auth.token) {
        store.dispatch(logout());
        notify("warning", "Your session has expired. Please log in again.");
      }
    } else if (status === 403) {
      notify("error", "You don't have permission to do that.");
    } else if (status >= 500) {
      notify("error", "Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

// Turns any Axios error into a readable message for the UI
export const getErrorMessage = (error) =>
  error.response?.data?.message ||
  (error.request
    ? "Cannot reach the server. Is the backend running?"
    : "Something went wrong");

export default api;