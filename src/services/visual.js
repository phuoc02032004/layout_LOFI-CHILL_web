import apiClient from "../CustomAxios/apiClient";
import Cookies from "js-cookie";

const createVisual = async (title, imgFile, VideoFile, vip) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("image", imgFile);
    formData.append("video", VideoFile);
    formData.append("vip", vip);

    const response = await apiClient.post(
      "http://localhost:3002/api/v1/visual/createVisual",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Visual Created: ", response.data);
  } catch (error) {
    console.error(
      "Error creating Visual:",
      error.response ? error.response.data : error.message
    );
  }
};

const getAllVisual = async () => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const response = await apiClient.get(
      "/visual/getAllVisual",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.visual.map((visual) => ({
      id: visual.id,
      title: visual.Title,
      urlImg: visual.imgUrl,
      urlVideo: visual.videoUrl,
      vip: visual.vip,
    }));
  } catch (error) {
    console.error("Error fetching visuals:", error);
    throw error;
  }
};

const updateVisual = async (id, title, imgFile, videoFile, vip) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const formData = new FormData();
    if (title) {
      formData.append("Title", title);
    }

    if (imgFile) {
      formData.append("image", imgFile);
    }

    if (videoFile) {
      formData.append("video", videoFile);
    }

    if (vip !== undefined) {
      formData.append("vip", vip);
    }

    const response = await apiClient.put(
      `http://localhost:3002/api/v1/visual/updateVisual/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Visual Updated: ", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating Visual:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const deleteVisual = async (visualId) => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    throw new Error("Token not found. Please log in.");
  }
  try {
    const response = await apiClient.delete(
      `http://localhost:3002/api/v1/visual/deleteVisual/${visualId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Visual Deleted:", response.data);
  } catch (error) {
    console.error(
      "Error deleting Visual:",
      error.response ? error.response.data : error.message
    );
  }
};


export { createVisual, getAllVisual, updateVisual, deleteVisual };
