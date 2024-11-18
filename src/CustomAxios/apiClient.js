import axios from "axios";
import { refreshAccessToken } from "../services/auth";
import Cookies from 'js-cookie';


const apiClient = axios.create({
    baseURL: 'http://localhost:3002/api/v1',
    withCredentials: true,
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 403) {
            const originalRequest = error.config;

            // Lấy refreshToken và userId từ localStorage
            const refreshToken = Cookies.get('refreshToken');
            const id = localStorage.getItem('userId');
            console.log('Attempting token refresh with:', { id, refreshToken });

            if (refreshToken && id) {
                try {
                    // Làm mới access token
                    const res = await refreshAccessToken(id, refreshToken);

                    // Lưu access token mới
                    const newAccessToken = res.data.accessToken;
                    Cookies.set('accessToken', newAccessToken);

                    // Gắn token mới vào header request và gửi lại request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    return Promise.reject(error);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;