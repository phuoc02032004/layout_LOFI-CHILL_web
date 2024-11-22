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

interface ApiResponse<T = any> {
  err: number;
  mes: string;
  data?: T;
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
    // Kiểm tra response status
    if (!responseAPI.status.toString().startsWith('2')) {
      throw new Error(`API request failed with status ${responseAPI.status}`);
    }
    return { err: 0, mes: 'Create sound effect successfully', data: responseAPI.data };
  } catch (error: any) {
    console.error('Error creating sound effect:', error);
    return { err: 1, mes: `Error: ${error.message}` };
  }
};

const getAllSound = async (): Promise<ApiResponse<Sound[]>> => {
  try {
    const response = await axios.get<any>(`${apiUrl}/getAllSoundEffect`); // Thay đổi thành any
    if (!response.status.toString().startsWith('2')) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    console.log("Response Data:", response.data); 
    if (response.data && response.data.soundEffect && Array.isArray(response.data.soundEffect)) {
        return {
            err: response.data.err,
            mes: response.data.mes,
            data: response.data.soundEffect,
        };
    } else {
        return { err: 1, mes: "Dữ liệu không hợp lệ" };
    }
  } catch (error: any) {
    console.error('Error getting sound effects:', error);
    return { err: 1, mes: `Error: ${error.message}` };
  }
};

const updateSound = async (id: string, title?: string, description?: string, soundFile?: { uri: string; type: string; name: string }): Promise<ApiResponse<Sound>> => {
  try {
    const formData = new FormData();
    if (title) formData.append('Title', title);
    if (description) formData.append('Description', description);
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

    if (!response.status.toString().startsWith('2')) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return { err: 0, mes: 'Update sound effect successfully', data: response.data };
  } catch (error: any) {
    console.error('Error updating sound effect:', error);
    return { err: 1, mes: `Error: ${error.message}` };
  }
};

const deleteSound = async (soundId: string): Promise<ApiResponse<Sound>> => {
  try {
    const response = await axios.delete(`${apiUrl}/deleteSoundEffect/${soundId}`);
    if (!response.status.toString().startsWith('2')) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return { err: 0, mes: 'Delete sound effect successfully' };
  } catch (error: any) {
    console.error('Error deleting sound effect:', error);
    return { err: 1, mes: `Error: ${error.message}` };
  }
};

export { createSound, getAllSound, updateSound, deleteSound };