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
        document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        return response;
    } catch (error) {
        console.error('Error creating Payment:', error.response ? error.response.data : error.message);
    }
}

export { createPayment };