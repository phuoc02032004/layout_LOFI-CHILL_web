import axios from "axios";
const getPlaylists = async () => {
    try {
        const response = await axios.get("http://localhost:3002/api/v1/playlist/getAllPlaylist");
        return response;
    } catch (error) {
        throw error;
    }
};

export { getPlaylists };