import axios from "axios";
import Cookies from 'js-cookie';
import apiClient from '../CustomAxios/apiClient';

const createPayment = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.post('http://localhost:3002/api/v1/zalopay/create-payment', { userId }, {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error creating Payment:', error.response ? error.response.data : error.message);
    }
}

export { createPayment };