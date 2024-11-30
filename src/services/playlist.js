import axios from "axios";
import { CgCoffee } from "react-icons/cg";
import { PiBuildingsBold } from "react-icons/pi";
import { PiMoonStarsBold } from "react-icons/pi";
import { PiHeadphonesBold } from "react-icons/pi";
import { PiRadio } from "react-icons/pi";
import { PiCloudRainBold } from "react-icons/pi";
import { PiSunHorizonBold } from "react-icons/pi";
import { PiPawPrintBold } from "react-icons/pi";
import { PiBookOpenTextBold } from "react-icons/pi";
import Cookies from "js-cookie";
const iconMap = {
    CgCoffee: <CgCoffee />,
    PiBuildingsBold: <PiBuildingsBold />,
    PiMoonStarsBold: <PiMoonStarsBold />,
    PiHeadphonesBold: <PiHeadphonesBold />,
    PiRadio: <PiRadio />,
    PiCloudRainBold: <PiCloudRainBold />,
    PiSunHorizonBold: <PiSunHorizonBold />,
    PiPawPrintBold: <PiPawPrintBold />,
    PiBookOpenTextBold: <PiBookOpenTextBold />,
};


const createPlaylist = async (title, description, vip) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Token not found. Please log in.");
    }
  
    console.log("Data to be sent:", { Title: title, description, vip });  // Log dữ liệu
  
    try {
      const response = await axios.post(
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
    try {
        const response = await axios.get("http://localhost:3002/api/v1/playlist/getAllPlaylist");
        return response.data.playlist.map(playlist => ({
            id: playlist.id,
            name: playlist.Title,
            description: playlist.Description,
            icon: playlist.icon,
            vip: playlist.vip,
        }));
    } catch (error) {
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

        const response = await axios.put(`http://localhost:3002/api/v1/playlist/updatePlaylist/${playlistId}`, payload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

        console.log('Playlist Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error update Playlist:', error.response ? error.response.data : error.message);
        throw error; 
    }
};


const deletePlaylist = async (playlistId) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Token not found. Please log in.");
    }
    try {
        const response = await axios.delete(`http://localhost:3002/api/v1/playlist/deletePlaylist/${playlistId}`,{
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        console.log('Playlist Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting Playlist:', error.response ? error.response.data : error.message);
    }
}

export { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist };