import axios from "axios";

const apiUrl = 'http://192.168.2.177:3002/api/v1/song';

interface Song {
    id: string;
    Title: string;
    Artist: string;
    Url: string;
    urlImg: string;
}

const getNewSong = async (accessToken: string): Promise<{ title: string, image: string }[]> => {
    try {
        const response = await axios.get(`${apiUrl}/getNewSong`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = response.data.song.map((song: Song) => ({
            title: song.Title,
            image: song.urlImg,
        }));
        return data;
    } catch (error) {
        console.error('Error fetching music:', error);
        throw error;
    }
};

const playSong = async (playlistId: string): Promise<Song[]> => {
    try {
        const response = await axios.get(`${apiUrl}/playSong/${playlistId}`);
        return response.data.song.map((song: Song) => ({
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