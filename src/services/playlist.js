import apiClient from "../CustomAxios/apiClient";
import Cookies from "js-cookie";

const createPlaylist = async (title, description, vip) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
      throw new Error("Token not found. Please log in.");
  }

  console.log("Data to be sent:", { Title: title, description, vip });  

  try {
      const response = await apiClient.post(
          "http://localhost:3002/api/v1/playlist/createPlaylist",
          { Title: title, Description: description, vip: vip },
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );
      return response.data;
  } catch (error) {
      console.error("Error creating Playlist: ", error.response ? error.response.data : error);
      throw error;
  }
};

const getAllPlaylists = async () => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
      throw new Error("Token not found. Please log in.");
  }
  try {
      const response = await apiClient.get(
          "http://localhost:3002/api/v1/playlist/getAllPlaylist",
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );
      return response.data.playlist.map(playlist => ({
          id: playlist.id,
          name: playlist.Title,
          description: playlist.Description,
          icon: playlist.icon,
          vip: playlist.vip,
      }));
  } catch (error) {
      console.error("Error fetching playlists:", error.response ? error.response.data : error);
      throw error;
  }
};

const updatePlaylist = async (playlistId, Title, Description, vip) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
      throw new Error("Token not found. Please log in.");
  }

  try {
      const payload = {};
      if (Title) payload.Title = Title;
      if (Description) payload.Description = Description;
      if (vip !== undefined) payload.vip = vip;

      const response = await apiClient.put(
          `http://localhost:3002/api/v1/playlist/updatePlaylist/${playlistId}`,
          payload,
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );

      console.log('Playlist Updated:', response.data);
      return response.data;
  } catch (error) {
      console.error('Error updating Playlist:', error.response ? error.response.data : error.message);
      throw error; 
  }
};

const deletePlaylist = async (playlistId) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
      throw new Error("Token not found. Please log in.");
  }

  try {
      const response = await apiClient.delete(
          `http://localhost:3002/api/v1/playlist/deletePlaylist/${playlistId}`,
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );
      console.log('Playlist Deleted:', response.data);
  } catch (error) {
      console.error('Error deleting Playlist:', error.response ? error.response.data : error.message);
  }
};

export { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist };