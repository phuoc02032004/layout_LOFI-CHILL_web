import axios from "axios";

const createSound = async (title, description, soundFile) => {
    try {
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', description);
        formData.append('soundFile', soundFile);

        const response = await axios.post('http://localhost:3002/api/v1/soundEffect/createSoundEffect', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Sound Effect Created:', response.data);
    } catch (error) {
        console.error('Error creating sound effect:', error.response ? error.response.data : error.message);
    }
};

const getAllSound = async () => {
    try {
        const response = await axios.get('http://localhost:3002/api/v1/soundEffect/getAllSoundEffect');
        return response.data.soundEffect.map(sound => ({
            id: sound.id,
            title: sound.Title,
            url: sound.url,
        }));
    } catch (error) {
        console.error('Error fetching sound:', error);
        throw error;
    }
};

const updateSound = async (id, title, description, fileSound) => {
    try {
        const formData = new FormData();
        if (title) {
            formData.append('Title')
        }

        if (description) {
            formData.append('Description')
        }

        if (fileSound) {
            formData.append('Description')
        }

    } catch (error) {
        
    }
};

const deleteSound = async (soundId) => {
    try {
        const response = await axios.delete(`http://localhost:3002/api/v1/soundEffect/deleteSoundEffect/${soundId}`);
        console.log('Sound Effect Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting sound effect:', error.response ? error.response.data : error.message);
    }
};

export { createSound, getAllSound, deleteSound };
