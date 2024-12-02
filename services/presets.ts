import axios from "axios";
import Cookies from "js-cookie";

interface PresetCreateData {
  Title: string;
  Description: string;
  playlistId: string;
  visualId: string;
  sounds: { soundUrl: string; volume: number; soundTitle: string }[];
  vip: boolean;
}

interface Preset {
  image: string;
  id: string;
  name: string;
  description: string;
  visualVideoUrl: string | null;
  visualImgUrl: string | null;
  playlistId: string;
  sounds: { soundUrl: string; soundVol: number; soundTitle: string }[];
  vip: boolean;
}

const createPreset = async ({
  Title,
  Description,
  playlistId,
  visualId,
  sounds,
  vip,
}: PresetCreateData): Promise<any> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    console.log("createPreset: Request data:", {
      Title,
      Description,
      playlistId,
      visualId,
      sounds,
      vip,
    });
    const response = await axios.post(
      "http://192.168.2.177:3002/api/v1/presets/createPreset",
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
    console.log("createPreset: Response data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("createPreset: Error:", error);
    throw error;
  }
};

const getAllPreset = async (): Promise<Preset[]> => {
  try {
    const response = await axios.get<{ err: number; mes: string; presets: any[] }>(
      "http://192.168.2.177:3002/api/v1/presets/getAllPresets"
    );
    console.log("getAllPreset: Response data:", response.data);

    if (response.data && response.data.err === 0 && response.data.presets && response.data.presets.length > 0) {
      return response.data.presets.map((preset: any): Preset => ({
        id: preset.id,
        name: preset.Title,
        description: preset.Description,
        visualVideoUrl: preset.urls?.visualUrlVideo || null,
        visualImgUrl: preset.urls?.visualUrlImg || null,
        playlistId: preset.playlistId,
        sounds: preset.sounds?.map((sound: any) => ({
          soundUrl: sound.soundUrl,
          soundVol: sound.volume,
          soundTitle: sound.soundTitle,
        })) || [],
        vip: preset.vip,
        image: preset.url,
      }));
    } else {
      const errorMessage = response.data.mes || "Failed to fetch presets";
      console.error(`getAllPreset: Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("getAllPreset: Error:", error);
    throw error;
  }
};

const updatePreset = async (id: string, data: any): Promise<void> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    console.log("updatePreset: Request data:", { id, data });
    await axios.put(
      `http://192.168.2.177:3002/api/v1/presets/updatePreset/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("updatePreset: Preset Updated:", data);
  } catch (error: any) {
    console.error("updatePreset: Error:", error);
    throw error;
  }
};

const deletePreset = async (id: string): Promise<void> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    console.log("deletePreset: Deleting preset with ID:", id);
    await axios.delete(
      `http://192.168.2.177:3002/api/v1/presets/deletePreset/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("deletePreset: Preset Deleted:", id);
  } catch (error: any) {
    console.error("deletePreset: Error:", error);
    throw error;
  }
};

export { createPreset, getAllPreset, updatePreset, deletePreset };