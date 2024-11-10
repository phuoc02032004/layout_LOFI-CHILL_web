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

const getAllVisual = async (): Promise<VisualResponse> => {
  try {
    const response = await axios.get(`${apiUrl}/v1/visual/getAllVisual`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching visual:', error);
    throw error;
  }
};

export { getAllVisual };