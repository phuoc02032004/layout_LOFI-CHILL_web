import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';

export const getAllSong = async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra nếu id không tồn tại
        if (!{ id }) {
            return res.status(404).json({
                err: 1,
                mes: 'Playlist ID is required',
            });
        }
        const response = await services.song.getAllSong({ id });
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Songs not found',
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all song controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificSong = async (req, res) => {
    try {
        const { id } = req.params;
        const { idPlaylist } = req.params;

        const response = await services.song.getSpecificSong({ idPlaylist, id });

        // Nếu song không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Song not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific song controller:', error);
        return internalServerError(res);
    }
};

export const createSong = async (req, res) => {
    try {
        const { idPlaylist } = req.params;
        const { Artist, Title } = req.body;

        if (!req.file) {
            return res.status(400).json({
                err: 1,
                mes: 'File is required',
            });
        }

        const response = await services.song.createSong({ idPlaylist, Artist, Title }, req.file);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create song controller:', error);
        return internalServerError(res);
    }
};
