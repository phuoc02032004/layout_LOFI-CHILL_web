import axios from "axios";

const getNewMusic = async () => {
    try {
        const response = await axios.get('http://localhost:3002/api/v1/song/getAllSong/8IGsk6qmbyQx8h4Re0HJ');
        console.log(response.data); // Kiểm tra dữ liệu trả về
        const data = response.data.song.map(music => ({
            title: music.Title,
            image: music.urlImg,
        }));
        return data;
    } catch (error) {
        console.error('Error fetching music:', error);
        throw error;
    }
};


export { getNewMusic };