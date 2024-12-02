import apiClient from "../CustomAxios/apiClient";
import Cookies from "js-cookie";

const getNewSong = async () => {
    try {
        const response = await apiClient.get('/song/getNewSong', {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });

        console.log(response.data);
        const data = response.data.song.map(song => ({
            title: song.Title,
            image: song.urlImg,
        }));
        return data;
    } catch (error) {
        console.error('Error fetching music:', error.response || error.message);
        throw error;
    }
};

const playSong = async (playlistId) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
        throw new Error("Token not found. Please log in.");
    }
    try {
        const response = await apiClient.get(`http://localhost:3002/api/v1/song/playSong/${playlistId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data);
        return response.data.song.map(song => ({
            id: song.id,
            title: song.Title,
            artist: song.artistName,
            url: song.Url,
            img: song.urlImg,
        }));
    } catch (error) {
        console.error('Error fetching Music:', error);
        throw error;
    }
};

const getAllSong = async () => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
        throw new Error("Token not found. Please log in.");
    }
    try {
        const response = await apiClient.get('http://localhost:3002/api/v1/song/getAllSong', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Response data:', response.data);
        const data = response.data.map(song => ({
            id: song.id,
            title: song.Title,
            image: song.urlImg,
            idPlaylist: song.idPlaylist,
            description: song.Description,
            ArtistId: song.ArtistId,
            url: song.Url,
        }));

        console.log('check data', data);
        return data;
    } catch (error) {
        console.error('Error fetching music:', error);
        throw error;
    }
};

const createSong = async (ArtistId, idPlaylist, title, Description, imgFile, musicFile) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
        throw new Error("Token not found. Please log in.");
    }
    try {
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', Description);
        formData.append('image', imgFile);
        formData.append('music', musicFile);
        formData.append('ArtistId', ArtistId);

        const response = await apiClient.post(`http://localhost:3002/api/v1/song/createSong/${idPlaylist}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Song Created: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating song:', error.response ? error.response.data : error.message);
    }
};

const deleteSong = async (idPlaylist, id) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
        throw new Error("Token not found. Please log in.");
    }
    try {
        const response = await apiClient.delete(`http://localhost:3002/api/v1/song/deleteSong/${idPlaylist}/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Song Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting song:', error.response ? error.response.data : error.message);
    }
};

const updateSong = async (ArtistId, idPlaylist, id, title, Description, imgFile, musicFile) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
        throw new Error("Token not found. Please log in.");
    }
    try {
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', Description);
        formData.append('image', imgFile);
        formData.append('music', musicFile);
        formData.append('ArtistId', ArtistId);

        const response = await apiClient.put(`http://localhost:3002/api/v1/song/updateSong/${idPlaylist}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('Song Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating song:', error.response ? error.response.data : error.message);
    }
};





export { getNewSong, playSong, getAllSong, createSong, deleteSong, updateSong };