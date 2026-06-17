import axiosInstance
from "../config/axiosInstance";

export const saveMood =
  async (data: any) => {
    const response =
      await axiosInstance.post(
        "/api/moods",
        data
      );

    return response.data;
  };

export const getMoods =
  async () => {
    const response =
      await axiosInstance.get(
        "/api/moods"
      );

    return response.data;
  };