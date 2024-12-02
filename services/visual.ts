import axios from 'axios';

const apiUrl = 'http://192.168.2.177:3002/api';

interface Visual {
  id: string;
  imgUrl: string;
  videoUrl: string;
  Title: string;
  filePathVideo: string;
  filePathImg: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface VisualResponse {
  err: number;
  mes: string;
  visual: Visual[];
}

const getAllVisual = async (accessToken: string): Promise<VisualResponse> => {
  try {
    const response = await axios.get(`${apiUrl}/v1/visual/getAllVisual`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error fetching visual:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        throw new Error(`API request failed with status ${error.response.status}: ${error.response.data.mes || error.response.statusText}`); // Trả về thông báo lỗi từ server
      } else if (error.request) {

        console.error('Error fetching visual: No response received', error.request);
        throw new Error('No response received from the server');
      } else {
        console.error('Error fetching visual:', error.message);
        throw new Error(`Error setting up API request: ${error.message}`);
      }
    } else {
      console.error('Error fetching visual:', error);
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export { getAllVisual };