import axios from 'axios';

const apiUrl = 'http://192.168.2.177:3002/api';

const getAllVisual = async () => {
  try {
    const response = await axios.get(`${apiUrl}/v1/visual/getAllVisual`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching visual:', error);
    throw error;
  }
};

export { getAllVisual };
