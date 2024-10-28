import axios from "axios";

const getNewSong = async (accessToken) => {
    try {
        const response = await axios.get('http://localhost:3002/api/v1/song/getNewSong', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(response.data);
        const data = response.data.song.map(song => ({
            title: song.Title,
            image: song.urlImg,
        }));
        return data;
    } catch (error) {
        console.error('Error fetching music:', error);
        throw error;
    }
};

const playSong = async (playlistId) => {
    try {
        const response = await axios.get(`http://localhost:3002/api/v1/song/playSong/${playlistId}`);
        console.log(response.data);
        return response.data.song.map(song => ({
            id: song.id,
            title: song.Title,
            artist: song.Artist,
            url: song.Url,
            img: song.urlImg
        }));
    } catch (error) {
        console.error('Error fetching Music:', error);
        throw error;
    }
}

export { getNewSong, playSong };