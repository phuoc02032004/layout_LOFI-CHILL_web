import Cookies from 'js-cookie';
import apiClient from '../CustomAxios/apiClient';

const createArtist = async (name, Description, imgFile) => {
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('Description', Description);
        formData.append('fileImg', imgFile);

        const response = await apiClient.post('http://localhost:3002/api/v1/artist/createArtist', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });
        console.log('Artist Created: ', response.data);
    } catch (error) {
        console.error('Error creating Artist:', error.response ? error.response.data : error.message);
    }
};

const getAllArtist = async () => {
    try {
        const response = await apiClient.get('http://localhost:3002/api/v1/artist/getAllArtist', {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });
        return response.data.artists.map(artist => ({
            id: artist.id,
            title: artist.name,
            description: artist.Description,
            image: artist.urlImg,
        }));
    } catch (error) {
        console.error('Error fetching artists:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getSpecificArtist = async (artistId) => {
    try {
        const response = await apiClient.get(`http://localhost:3002/api/v1/artist/getSpecificArtist/${artistId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });
        if (response.data.err === 0) {
            const artist = response.data.artist;
            return {
                id: artist.id,
                name: artist.name,
                description: artist.Description,
                image: artist.urlImg,
            };
        } else {
            throw new Error(response.data.mes || "Artist not found");
        }
    } catch (error) {
        console.error('Error fetching specific artist:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const updateArtist = async (id, name, Description, imgFile) => {
    try {
        const formData = new FormData();
        if (name) formData.append('name', name);
        if (Description) formData.append('Description', Description);
        if (imgFile) formData.append('fileImg', imgFile);

        const response = await apiClient.put(`http://localhost:3002/api/v1/artist/updateArtist/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });

        console.log('Artist Updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating Artist:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const deleteArtist = async (artistId) => {
    try {
        const response = await apiClient.delete(`http://localhost:3002/api/v1/artist/deleteArtist/${artistId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });
        console.log('Artist Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting Artist:', error.response ? error.response.data : error.message);
    }
};

const getArtistSong = async (artistId) => {
    try {
        const response = await apiClient.get(`http://localhost:3002/api/v1/artist/getArtistSong/${artistId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });
        if (response.status === 200) {
            return response.data; // Trả về danh sách bài hát
        } else {
            throw new Error(response.data.mes || "Error fetching artist's songs");
        }
    } catch (error) {
        console.error('Error fetching artist songs:', error.response ? error.response.data : error.message);
        throw error;
    }
};




export { createArtist, getAllArtist, getSpecificArtist, updateArtist, deleteArtist, getArtistSong };
