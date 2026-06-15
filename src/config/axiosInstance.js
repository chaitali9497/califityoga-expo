import axios from "axios";
import API_BASE_URL from "./api";
import { getAuthToken } from "@/src/store/authStorage";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  // Increased timeout for Render free tier cold starts
  timeout: 60000,

  // Important for some mobile requests
 // withCredentials: true,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();

      console.log(
        "🌍 FULL URL:",
        `${config.baseURL}${config.url}`
      );

      console.log(
        "📦 REQUEST DATA:",
        config.data
      );

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error(
        "❌ REQUEST ERROR:",
        error
      );

      return Promise.reject(error);
    }
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "✅ RESPONSE:",
      response.data
    );

    return response;
  },

  async (error) => {
    console.log(
      "❌ FULL ERROR:",
      error
    );

    // Timeout / Render sleeping
    if (
      error.code === "ECONNABORTED"
    ) {
      console.log(
        "⏳ Render server is waking up..."
      );
    }

    // Backend responded
    if (error.response) {
      console.log(
        "❌ STATUS:",
        error.response.status
      );

      console.log(
        "❌ RESPONSE DATA:",
        error.response.data
      );

      console.log(
        "❌ RESPONSE HEADERS:",
        error.response.headers
      );
    }

    // No response
    else if (error.request) {
      console.log(
        "❌ NO RESPONSE RECEIVED"
      );

      console.log(error.request);
    }

    // Other axios error
    else {
      console.log(
        "❌ AXIOS ERROR MESSAGE:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;