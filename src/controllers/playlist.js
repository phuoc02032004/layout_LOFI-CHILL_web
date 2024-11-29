import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js';
import joi from 'joi'
import { Title, Description, vip } from '../helper/joi_schema.js';


export const createPlaylist = async (req, res) => {
    try {
        const { error } = joi.object({ Title, Description, vip }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.playlist.createPlaylist(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create playlist controller:', error);
        return internalServerError(res);
    }
};

export const getAllPlaylist = async (req, res) => {
    try {
        const response = await services.playlist.getAllPlaylist(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all playlist controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.playlist.getSpecificPlaylist({ id });

        // Nếu playlist không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Playlist not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific playlist controller:', error);
        return internalServerError(res);
    }
};


export const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy dữ liệu từ req.body để cập npohật
        const data = req.body;

        const response = await services.playlist.updatePlaylist({ id, data });

        // Nếu user không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Playlist not found',
            });
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in update playlist controller:', error);
        return internalServerError(res);
    }
};

export const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.playlist.deletePlaylist({ id });

        // Nếu Playlist không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Playlist not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in delete Playlist controller:', error);
        return internalServerError(res);
    }
};