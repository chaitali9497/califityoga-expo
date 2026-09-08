import { getAuthToken } from "@/src/store/authStorage";
import axios from "axios";
import API_BASE_URL from "./api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();

      console.log(
        "🌍 REQUEST:",
        config.method?.toUpperCase(),
        config.url
      );

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("❌ REQUEST INTERCEPTOR ERROR:", error);
      return Promise.reject(error);
    }
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "✅ RESPONSE:",
      response.config.method?.toUpperCase(),
      response.config.url,
      response.status
    );

    return response;
  },

  async (error) => {
    if (error.response) {
      console.error(
        "❌ API ERROR:",
        error.config?.method?.toUpperCase(),
        error.config?.url,
        error.response.status
      );

      console.error(
        "❌ SERVER MESSAGE:",
        error.response.data?.message ||
          error.response.data?.error ||
          "Unknown server error"
      );
    } else if (error.request) {
      console.error("❌ NO RESPONSE FROM SERVER");
    } else {
      console.error("❌ AXIOS ERROR:", error.message);
    }

    if (error.code === "ECONNABORTED") {
      console.error("⏳ Request timed out. Server may be waking up.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;