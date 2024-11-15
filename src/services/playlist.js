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
        return response.data.playlist; // Trả về playlist từ API
    } catch (error) {
        if (error.response) {
            console.error('Error creating Playlist:', error.response.data);  // Log chi tiết lỗi từ server
        } else {
            console.error('Error creating Playlist:', error.message);
        }
        throw error; // Quăng lỗi để xử lý ở nơi gọi hàm
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

const updatePlaylist = async (playlistId, Title, Description) => {
    try {
        const payload = {};
        if (Title) payload.Title = Title;
        if (Description) payload.Description = Description;
        const response = await axios.put(`http://localhost:3002/api/v1/playlist/updatePlaylist/${playlistId}`, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        console.log('Playlist Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error update Playlist:', error.response ? error.response.data : error.message);
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

export { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist };