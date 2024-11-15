import axios from 'axios';
import Cookies from 'js-cookie';
const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/register', userData);
        return response;
    } catch (error) {
        throw error;
    }
};

const verify = async (email, code) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/verify', {
            email: email,
            code: code
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3002/api/v1/auth/login', {
            email,
            password
        }, 
        {
            withCredentials: true 
        });
        const { accessToken, refreshToken } = response.data;

        Cookies.set('accessToken', accessToken, { expires: 1 / 24 });
        Cookies.set('refreshToken', refreshToken, { expires: 7 });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export { registerUser };
export { verify };
export { loginUser };