import apiClient from "../CustomAxios/apiClient";
import axios from "axios";
import Cookies from "js-cookie";

const createVisual = async (title, imgFile, VideoFile) => {
    try {
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('image', imgFile);
        formData.append('video', VideoFile);

        const response = await axios.post('http://localhost:3002/api/v1/visual/createVisual', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        console.log('Visual Created: ', response.data);
    } catch (error) {
        console.error('Error creating Visual:', error.response ? error.response.data : error.message);
    }
};

const getAllVisual = async () => {
    try {
        const response = await apiClient.get('/visual/getAllVisual', {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            }
        });
        return response.data.visual.map(visual => ({
            id: visual.id,
            title: visual.Title,
            urlImg: visual.imgUrl,
            urlVideo: visual.videoUrl,
            vip: visual.vip,
        }));
    } catch (error) {
        console.error('Error fetching sound:', error);
        throw error;
    }
};

const updateVisual = async (id, title, imgFile, videoFile) => {
    try {
        const formData = new FormData();
        if (title) {
            formData.append('Title', title);
        }

        if (imgFile) {
            formData.append('image', imgFile);
        }

        if (videoFile) {
            formData.append('video', videoFile);
        }

        const response = await axios.put(`http://localhost:3002/api/v1/visual/updateVisual/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        console.log('Visual Updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating Visual:', error.response ? error.response.data : error.message);
        throw error;
    }
};


const deleteVisual = async (visualId) => {
    try {
        const response = await axios.delete(`http://localhost:3002/api/v1/visual/deleteVisual/${visualId}`);
        console.log('Visual Deleted:', response.data);
    } catch (error) {
        console.error('Error deleting Visual:', error.response ? error.response.data : error.message);
    }
};

export { createVisual, getAllVisual, updateVisual, deleteVisual };