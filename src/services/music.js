import axios from "axios";
const getNewMusic = async () => {
    try {
        const response = await axios.get('http://localhost:3002/api/v1/music/getAllMusic/:id');
        const data = response.data.map(music => ({
            title: music.Title,
            urlImg: music.urlImg,
        }));
        return data;
    } catch (error) {
        throw error;
    }
};

export { getNewMusic };