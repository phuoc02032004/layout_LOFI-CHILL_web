import Cookies from "js-cookie";
import apiClient from '../CustomAxios/apiClient';

const createPreset = async ({
  Title,
  Description,
  playlistId,
  visualId,
  sounds,
  vip,
}) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const response = await apiClient.post(
      "http://localhost:3002/api/v1/presets/createPreset",
      {
        Title,
        Description,
        playlistId,
        visualId,
        sounds,
        vip,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating preset:", error.response?.data || error.message);
    throw error;
  }
};

const getAllPreset = async () => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const response = await apiClient.get(
      "http://localhost:3002/api/v1/presets/getAllPresets",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data && response.data.err === 0) {
      return response.data.presets.map((preset) => ({
        id: preset.id,
        name: preset.Title,
        description: preset.Description,
        visualVideoUrl: preset.urls.visualUrlVideo,
        visualImgUrl: preset.urls.visualUrlImg,
        playlistId: preset.playlistId,
        sounds: preset.urls.soundDetails.map((sound) => ({
          soundUrl: sound.soundUrl,
          soundVol: sound.volume,
          soundTitle: sound.soundTitle,
        })),
        vip: preset.vip,
      }));
    } else {
      throw new Error(response.data.mes || "Failed to fetch presets");
    }
  } catch (error) {
    console.error("Error fetching presets:", error);
    return [];
  }
};


const updatePreset = async (id, data) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const response = await apiClient.put(
      `http://localhost:3002/api/v1/presets/updatePreset/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Preset Updated:", response.data);
  } catch (error) {
    console.error(
      "Error updating Preset:",
      error.response ? error.response.data : error.message
    );
  }
};

const deletePreset = async (id) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const response = await apiClient.delete(
      `http://localhost:3002/api/v1/presets/deletePreset/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Preset Deleted:", response.data);
  } catch (error) {
    console.error(
      "Error deleting Preset:",
      error.response ? error.response.data : error.message
    );
  }
};


export { createPreset, getAllPreset, updatePreset, deletePreset };
