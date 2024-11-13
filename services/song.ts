import axios from "axios";

const apiUrl = 'http://10.50.2.157:3002/api/v1/song';

interface Song {
    id: string;
    title: string;
    ArtistId: string;
    url: string;
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
            title: song.title,
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
            title: song.title,
            artist: song.ArtistId,
            url: song.url,
            img: song.urlImg
        }));
    } catch (error) {
        console.error('Error fetching Music:', error);
        throw error;
    }
}

export { getNewSong, playSong };