import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js';
import joi from 'joi';
import { name, Description } from '../helper/joi_schema.js';

export const createArtist = async (req, res) => {
    try {
        const { name, Description, songID } = req.body;
        const { error } = joi.object({ name, Description }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const response = await services.artist.createArtist({ ...req.body }, req.file);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create artis controller:', error);
        return internalServerError(res);
    }
};

export const getAllArtist = async (req, res) => {
    try {
        const response = await services.artist.getAllArtist();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all artis controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.artist.getSpecificArtist({ id });

        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Artis not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific artis controller:', error);
        return internalServerError(res);
    }
};

export const updateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const response = await services.artist.updateArtist({ id, data }, req.file);

        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Artis not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in update artis controller:', error);
        return internalServerError(res);
    }
};

export const deleteArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.artist.deleteArtist({ id });

        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Artis not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in delete artis controller:', error);
        return internalServerError(res);
    }
};

export const getArtistSong = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.artist.getArtistSong({ id });
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Artis song not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get artist song:', error);
        return internalServerError(res);
    }
}