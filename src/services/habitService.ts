import { isAxiosError } from "axios";
import axiosInstance from "../config/axiosInstance";
import { API_ENDPOINTS } from "../config/api";
import { Habit } from "@/src/types/Habit";

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

export const getAllHabits = async () => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.HABITS.GET_ALL
  );

  return response.data;
};

export const createHabit = async (
  habit: Habit
) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HABITS.CREATE,
    habit
  );

  return response.data;
};

export const getHabitById = async (
  id: string
) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.HABITS.GET_BY_ID(id)
  );

  return response.data;
};

export const updateHabit = async (
  id: string,
  habit: Partial<Habit>
) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.HABITS.UPDATE(id),
    habit
  );

  return response.data;
};

export const deleteHabit = async (
  id: string
) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.HABITS.DELETE(id)
  );

  return response.data;
};

export { getApiErrorMessage };