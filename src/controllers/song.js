import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';
import joi from 'joi'
import { Title, Description, ArtistId } from '../helper/joi_schema.js';

// Create Song
export const createSong = async (req, res) => {
    try {
        const { idPlaylist } = req.params;
        const { error } = joi.object({ Title, Description, ArtistId }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        if (!idPlaylist) {
            return res.status(400).json({
                err: 1,
                mes: 'Playlist ID is required',
            });
        }

        if (!req.files || !req.files.music || !req.files.image) {
            return res.status(400).json({
                err: 1,
                mes: 'Both image and music files are required',
            });
        }

        const musicFile = req.files.music[0];
        const imageFile = req.files.image[0];

        const response = await services.song.createSong({ idPlaylist, ...req.body }, musicFile, imageFile);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create song controller:', error);
        return internalServerError(res);
    }
};

export const getAllSong = async (req, res) => {
    try {
        const response = await services.song.getAllSong({});
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
}

export const getAllSongPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra nếu id không tồn tại
        if (!{ id }) {
            return res.status(404).json({
                err: 1,
                mes: 'Playlist ID is required',
            });
        }
        const response = await services.song.getAllSongPlaylist({ id });
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Songs not found',
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all song in playlist controller:', error);
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

export const getNewSong = async (req, res) => {
    try {
        const response = await services.song.getNewSong(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get new song controller:', error);
        return internalServerError(res);
    }
};

export const updateSong = async (req, res) => {
    try {
        const { idPlaylist } = req.params;

        const { id } = req.params;

        const data = req.body;

        const imageFile = req.files?.image?.[0];
        const musicFile = req.files?.music?.[0];

        const response = await services.song.updateSong({ idPlaylist, id, data }, musicFile, imageFile);

        // Nếu Song không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Song not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in update Song controller:', error);
        return internalServerError(res);
    }
};

export const deleteSong = async (req, res) => {
    try {
        const { idPlaylist } = req.params;

        const { id } = req.params;

        const response = await services.song.deleteSong({ idPlaylist, id });

        // Nếu Song không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Song not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in delete Song controller:', error);
        return internalServerError(res);
    }
};

export const playSong = async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra nếu id không tồn tại
        if (!{ id }) {
            return res.status(404).json({
                err: 1,
                mes: 'Playlist ID is required',
            });
        }
        const response = await services.song.playSong({ id });
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Songs not found',
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get random song controller:', error);
        return internalServerError(res);
    }
};