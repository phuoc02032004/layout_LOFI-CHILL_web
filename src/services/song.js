import axios from "axios";

const getNewSong = async (accessToken) => {
    try {
        const response = await axios.get('http://localhost:3002/api/v1/song/getNewSong', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true,
        }
        );

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

const getAllSong = async () => {
    try {
        const response = await axios.get('http://localhost:3002/api/v1/song/getAllSong')

        const data = response.data.map(song => ({
            id: song.id,
            title: song.Title,
            image: song.urlImg,
            idPlaylist: song.idPlaylist
        }));

        console.log('check data', data)
        return data;
    } catch (error) {
        console.error('Error fetching music:', error);
        throw error;
    }
};

const createSong = async (ArtistId, idPlaylist, title, Description, imgFile, musicFile) => {
    try {
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', Description);
        formData.append('image', imgFile);
        formData.append('music', musicFile);
        formData.append('ArtistId', ArtistId);

        const response = await axios.post(`http://localhost:3002/api/v1/song/createSong/${idPlaylist}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        console.log('song Created: ', response.formData);
        return formData;
    } catch (error) {
        console.error('Error creating song:', error.response ? error.response.data : error.message);
    }
};

const deleteSong = async (idPlaylist, id) => {
    try {
        const response = await axios.delete(`http://localhost:3002/api/v1/song/deleteSong/${idPlaylist}/${id}`);
        console.log('Song Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting song:', error.response ? error.response.data : error.message);
    }
};

const updateSong = async (ArtistId, idPlaylist, id, title, Description, imgFile, musicFile) => {
    try {
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', Description);
        formData.append('image', imgFile);       // Phải trùng với cấu hình multer trên backend
        formData.append('music', musicFile);      // Phải trùng với cấu hình multer trên backend
        formData.append('ArtistId', ArtistId);

        const response = await axios.put(`http://localhost:3002/api/v1/song/updateSong/${idPlaylist}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        console.log('Song Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating song:', error.response ? error.response.data : error.message);
    }
};




export { getNewSong, playSong, getAllSong, createSong, deleteSong, updateSong };