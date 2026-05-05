import axios from "axios";

// Use localhost for development, or a deployed URL for production
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
