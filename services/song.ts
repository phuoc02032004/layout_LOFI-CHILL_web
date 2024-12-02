import axios from "axios";

const apiUrl = 'http://192.168.2.177:3002/api/v1/song';

interface Song {
  id: string;
  ArtistId: string;
  Title: string;
  Url: string;
  Description: string;
  urlImg: string;
  filePath: string;
  filePathImg: string;
}

interface ApiResponse<T> {
    err: number;
    mes: string;
    data: T;
  }

const getNewSong = async (accessToken: string): Promise<Song[] | null> => {
    try {
        const response = await axios.get(`${apiUrl}/getNewSong`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (response.status !== 200) {
          console.error(`API returned error status code: ${response.status}`);
          return null;
        }
        if (response.data.err !== 0) {
          return null;
        }
        return response.data.song;
    } catch (error: any) {
        console.error('Network Error fetching music:', error);
        if(error.response){
            console.error(`HTTP Status Code: ${error.response.status}, Data:`, error.response.data);
        }
        return null;
    }
};

const playSong = async (playlistId: string): Promise<Song[]> => {
    try {
        const response = await axios.get(`${apiUrl}/playSong/${playlistId}`);
        return response.data.song.map((song: any) => ({ 
            id: song.id,
            title: song.Title,
            artist: song.ArtistId,
            url: song.Url,  
            img: song.urlImg,
            description: song.Description
        }));
    } catch (error) {
        console.error('Error fetching Music:', error);
        throw error;
    }
};

const getAllSong = async (accessToken: string): Promise<Song[]> => {
    try {
        const response = await axios.get(`${apiUrl}/getAllSong`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Directly return the response.data 
        return response.data; 
    } catch (error) {
        console.error('Error fetching Music:', error);
        throw error;
    }
};

const getSpecificSong = async (playlistId: string, songId: string): Promise<ApiResponse<Song> | null> => {
    try {
      const response = await axios.get(`/api/v1/song/getSpecificSong/${playlistId}/${songId}`);
      if (response.status === 200 && response.data.err === 0) {
        return response.data; // Success: return the song data
      } else {
        console.error(`Error fetching song: ${response.status} - ${response.data.mes}`);
        return null; // Or throw an error, depending on your error handling strategy
      }
    } catch (error: any) {
      console.error('Error fetching song:', error);
      return null; // Or throw an error
    }
  };

export { getNewSong, playSong, getAllSong, getSpecificSong };