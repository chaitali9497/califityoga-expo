import { isAxiosError } from "axios";
import axiosInstance from "../config/axiosInstance";

type AuthPayload = {
  name: string; // Optional for login, required for registration
  email: string;
  password: string;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Request failed. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export const login = async ({ email, password }: AuthPayload) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email: email.trim(),
    password,
  });

  return response.data;
};

export const register = async ({ email, password }: AuthPayload) => {
  const response = await axiosInstance.post("/api/auth/register", {
    email: email.trim(),
    password,
  });

  return response.data;
};

export { getApiErrorMessage };
