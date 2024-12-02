import apiClient from "../CustomAxios/apiClient";
import Cookies from 'js-cookie';

const getHistory = async () => {
  try {
    const userId = localStorage.getItem("userId");

    const response = await apiClient.get(
      "http://localhost:3002/api/v1/history/getHistory",
      {
        params: { userId },
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`, 
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Failed to fetch history");
  } catch (error) {
    console.error("Error fetching history:", error.response ? error.response.data : error.message);
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
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`, 
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(response.data.message || "Failed to add history");
  } catch (error) {
    console.error("Error adding history:", error.response ? error.response.data : error.message);
    throw error;
  }
};


export { getHistory, addHistory };
