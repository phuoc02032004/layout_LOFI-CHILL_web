import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js';
import joi from 'joi';
import { Artist, Description } from '../helper/joi_schema.js';

export const createArtis = async (req, res) => {
    try {
        const { error } = joi.object({ Artist, Description }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.artis.createArtis(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create artis controller:', error);
        return internalServerError(res);
    }
};

export const getAllArtis = async (req, res) => {
    try {
        const response = await services.artis.getAllArtis();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all artis controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificArtis = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.artis.getSpecificArtis({ id });

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

export const updateArtis = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const response = await services.artis.updateArtis({ id, data });

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

export const deleteArtis = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.artis.deleteArtis({ id });

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
