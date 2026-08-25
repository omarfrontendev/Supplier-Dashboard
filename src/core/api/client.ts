import { clearToken, getToken } from "@/core/auth/token";
import axios from "axios";
import { handleUnauthorized } from "../auth/auth-handler";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 💡 Base URL from environment variables
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const language = localStorage.getItem("language") || "en"; // default

    if (config.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers["Accept-Language"] = language;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getToken();
    if (error.response?.status === 401 && token) {
      // 💡 Handle Unauthorized error (e.g., logout user)
      clearToken();
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);
