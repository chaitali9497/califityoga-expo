/**
 * API Configuration
 * Base URL for all API requests
 */

const API_BASE_URL = "https://califityoga-expo.onrender.com";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },

  // Habit endpoints
  HABITS: {
    GET_ALL: "/api/habits",
    CREATE: "/api/habits",
    GET_BY_ID: (id: string) => `/api/habits/${id}`,
    UPDATE: (id: string) => `/api/habits/${id}`,
    DELETE: (id: string) => `/api/habits/${id}`,
  },

  // Health check
  HEALTH: "/api/health",
};

export default API_BASE_URL;
