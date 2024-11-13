import axios from 'axios';

const apiUrl = 'http://10.50.2.157:3002/api/v1/soundEffect';

interface Sound {
  id: string;
  Description: string;
  filePath: string;
  Title: string;
  url: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface SoundEffectResponse {
  err: number;
  mes: string;
  soundEffect: Sound[];
}

const createSound = async (title: string, description: string, soundFile: { uri: string; type: string; name: string }) => {
  try {
    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Description', description);

    const response = await fetch(soundFile.uri);
    const blob = await response.blob();

    formData.append('soundFile', blob, soundFile.name); 

    const responseAPI = await axios.post(`${apiUrl}/createSoundEffect`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return responseAPI.data;
  } catch (error) {
    throw error;
  }
};

const getAllSound = async (): Promise<SoundEffectResponse> => {
  try {
    const response = await axios.get(`${apiUrl}/getAllSoundEffect`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateSound = async (id: string, title?: string, description?: string, soundFile?: { uri: string; type: string; name: string }) => {
  try {
    const formData = new FormData();
    if (title) {
      formData.append('Title', title);
    }
    if (description) {
      formData.append('Description', description);
    }
    if (soundFile) {
      const response = await fetch(soundFile.uri);
      const blob = await response.blob();

      formData.append('soundFile', blob, soundFile.name); 
    }

    const response = await axios.put(`${apiUrl}/updateSoundEffect/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteSound = async (soundId: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/deleteSoundEffect/${soundId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { createSound, getAllSound, updateSound, deleteSound };