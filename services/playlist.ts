import axios, { AxiosResponse } from 'axios';

const apiUrl = 'http://192.168.2.177:3002/api/v1/playlist';

interface Playlist {
  id: string;
  Title: string;
  Description: string;
  filePathPlaylist?: string;
  createdAt?: { _seconds: number; _nanoseconds: number };
  updatedAt?: { _seconds: number; _nanoseconds: number };
}

interface PlaylistResponse {
  err: number;
  mes: string;
  playlist: Playlist[];
}

const createPlaylist = async (title: string, description: string): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.post(
      `${apiUrl}/createPlaylist`,
      {
        Title: title,
        Description: description,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Playlist Created:', response.data);
  } catch (error: any) {
    if (error.response) {
      console.error('Error creating Playlist:', error.response.data);
    } else {
      console.error('Error creating Playlist:', error.message);
    }
  }
};

const getAllPlaylists = async (): Promise<PlaylistResponse> => {
  try {
    const response: AxiosResponse<PlaylistResponse> = await axios.get(`${apiUrl}/getAllPlaylist`);
    
    if (response.data.err !== 0) {
      throw new Error(response.data.mes);
    }

    return response.data; // Return the entire response object
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

const updatePlaylist = async (
  playlistId: string,
  Title?: string,
  Description?: string
): Promise<any> => {
  try {
    const payload: { Title?: string; Description?: string } = {};
    if (Title) payload.Title = Title;
    if (Description) payload.Description = Description;

    const response: AxiosResponse = await axios.put(
      `${apiUrl}/updatePlaylist/${playlistId}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Playlist Updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating Playlist:', error.response ? error.response.data : error.message);
  }
};

const deletePlaylist = async (playlistId: string): Promise<void> => {
  try {
    const response: AxiosResponse = await axios.delete(
      `${apiUrl}/deletePlaylist/${playlistId}`
    );
    console.log('Playlist Deleted:', response.data);
  } catch (error: any) {
    console.error('Error deleting Playlist:', error.response ? error.response.data : error.message);
  }
};

export { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist };