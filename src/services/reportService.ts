import { isAxiosError } from "axios";
import axiosInstance from "../config/axiosInstance";
import { API_ENDPOINTS } from "../config/api";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const getApiErrorMessage = (
  error: unknown
) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch report"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export const getReport =
  async () => {
    try {
      const response =
        await axiosInstance.get(
          API_ENDPOINTS.REPORTS.GET
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  };

export { getApiErrorMessage };