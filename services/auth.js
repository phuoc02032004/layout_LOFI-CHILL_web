import axios from 'axios';

const apiUrl = 'http://10.50.2.7:3002/api';

const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/v1/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { loginUser };