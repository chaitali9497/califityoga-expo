import axiosInstance from "../config/axiosInstance";

export const getReport =
  async () => {
    const response =
      await axiosInstance.get(
        "/api/reports"
      );

    return response.data;
  };