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
      "Request failed. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export type MoodPayload = {
  date: string;
  mood: string;
  feeling?: string;
  note?: string;
};

export const saveMood =
  async (data: MoodPayload) => {
    try {
      const response =
        await axiosInstance.post(
          API_ENDPOINTS.MOODS.CREATE,
          data
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  };

export const getMoods =
  async () => {
    try {
      const response =
        await axiosInstance.get(
          API_ENDPOINTS.MOODS.GET
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error)
      );
    }
  };

export { getApiErrorMessage };