import axios from 'axios';
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
        const response = await axios.post(
            'http://localhost:3002/api/v1/auth/login',
            {
                email: email,
                password: password
            },
            {
                withCredentials: true // Cho phép gửi và nhận cookie
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export { registerUser };
export { verify };
export { loginUser };