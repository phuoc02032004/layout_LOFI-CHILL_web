import axios from "axios";

const createPlaylist = async (title, description) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/playlist/createPlaylist', {
            Title: title,
            Description: description,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Playlist Created:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error creating Playlist:', error.response.data);  // Log detailed server response
        } else {
            console.error('Error creating Playlist:', error.message);
        }
    }
};


const getAllPlaylists = async () => {
    try {
        const response = await axios.get("http://localhost:3002/api/v1/playlist/getAllPlaylist");
        return response.data.playlist.map(playlist => ({
            id: playlist.id,
            name: playlist.Title,
            description: playlist.Description
        }));
    } catch (error) {
        throw error;
    }
};

const deletePlaylist = async (playlistId) => {
    try {
        const response = await axios.delete(`http://localhost:3002/api/v1/playlist/deletePlaylist/${playlistId}`);
        console.log('Playlist Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting Playlist:', error.response ? error.response.data : error.message);
    }
}

export { createPlaylist, getAllPlaylists, deletePlaylist };