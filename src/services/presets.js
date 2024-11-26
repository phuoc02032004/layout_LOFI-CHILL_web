import axios from "axios";

const createPreset = async ({ Title, Description, playlistId, visualId, sounds }) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/presets/createPreset', {
            Title,
            Description,
            playlistId,
            visualId,
            sounds,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating preset:', error);
        throw error;
    }
};

const getAllPreset = async () => {
    try {
        const response = await axios.get('http://localhost:3002/api/v1/presets/getAllPresets');

        if (response.data && response.data.err === 0) {
            // Duyệt qua các preset và xử lý nếu cần
            return response.data.presets.map(preset => ({
                id: preset.id,
                name: preset.Title,
                description: preset.Description,
                visualVideoUrl: preset.urls.visualUrlVideo,
                visualImgUrl: preset.urls.visualUrlImg,
                playlistId: preset.playlistId,
                sounds: preset.urls.soundDetails.map(sound => ({
                    soundUrl: sound.soundUrl,
                    soundVol: sound.volume,
                    soundTitle: sound.soundTitle
                })),
                vip: preset.vip,
            }));
        } else {
            throw new Error(response.data.mes || 'Failed to fetch presets');
        }
    } catch (error) {
        console.error('Error fetching presets:', error);
        return [];
    }
};

const updatePreset = async (id, data) => {
    try {
        const response = await axios.put(`http://localhost:3002/api/v1/presets/updatePreset/${id}`, data);
        console.log('Preset Updated:', response.data);
    } catch (error) {
        console.error('Error updating Preset:', error.response ? error.response.data : error.message);
    }
};


const deletePreset = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3002/api/v1/presets/deletePreset/${id}`);
        console.log('Preset Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting Preset:', error.response ? error.response.data : error.message);
    }
}

export { createPreset, getAllPreset, updatePreset, deletePreset };