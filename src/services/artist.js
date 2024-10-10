import axios from "axios";
const getArtists = async () => {
    try {
        const response = await axios.get("http://localhost:3002/api/v1/artist/getAllArtist");
        return response;
    } catch (error) {
        throw error;
    }
};
export { getArtists };