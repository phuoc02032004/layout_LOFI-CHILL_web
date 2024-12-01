import apiClient from "../CustomAxios/apiClient";
import axios from "axios";

const getHistory = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(
      "http://localhost:3002/api/v1/history/getHistory",
      { params: { userId }, }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Failed to fetch history");
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};

const addHistory = async (userId, playlistId, songId) => {
  try {
    const response = await apiClient.post(
      "http://localhost:3002/api/v1/history/addHistory",
      {
        userId,
        playlistId,
        songId,
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Failed to add history");
  } catch (error) {
    console.error("Error adding history:", error);
    throw error;
  }
};

export { getHistory, addHistory };
