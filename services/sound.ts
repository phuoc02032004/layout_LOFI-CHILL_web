import axios from 'axios';

const apiUrl = 'http://192.168.2.177:3002/api/v1/soundEffect';

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

interface ApiResponse<T> {
  err: number;
  mes: string;
}

const createSound = async (title: string, description: string, soundFile: { uri: string; type: string; name: string }): Promise<ApiResponse<Sound>> => {
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

    return {
      err: 0,
      mes: 'Create sound effect successfully',
    }
  } catch (error) {
    return {
      err: 1,
      mes: 'Error creating sound effect',
    }
  }
};

const getAllSound = async (): Promise<ApiResponse<Sound[]>> => {
  try {
    const response = await axios.get(`${apiUrl}/getAllSoundEffect`);
    return response.data;
  } catch (error) {
    return {
      err: 1,
      mes: 'Error getting sound effects',
    }
  }
};

const updateSound = async (id: string, title?: string, description?: string, soundFile?: { uri: string; type: string; name: string }): Promise<ApiResponse<Sound>> => {
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

    return {
      err: 0,
      mes: 'Update sound effect successfully',
    }
  } catch (error) {
    return {
      err: 1,
      mes: 'Error updating sound effect',
    }
  }
};

const deleteSound = async (soundId: string): Promise<ApiResponse<Sound>> => {
  try {
    const response = await axios.delete(`${apiUrl}/deleteSoundEffect/${soundId}`);
    return {
      err: 0,
      mes: 'Delete sound effect successfully',
    }
  } catch (error) {
    return {
      err: 1,
      mes: 'Error deleting sound effect',
    }
  }
};

export { createSound, getAllSound, updateSound, deleteSound };