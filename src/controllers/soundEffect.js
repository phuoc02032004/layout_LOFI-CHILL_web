import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js';
import joi from 'joi'
import { Title, Description } from '../helper/joi_schema.js';

export const createSoundEffect = async (req, res) => {
    try {
        const { Title, Description, vip } = req.body;
        const { error } = joi.object({ Title, Description, vip: joi().boolean().require() }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        if (!req.file) {
            // console.log('File not found in request:', req);
            return res.status(400).json({ error: 'Sound file is required' });
        }

        const response = await services.soundEffect.createSoundEffect({ Title, Description, vip }, req.file);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create soundEffect controller:', error);
        return internalServerError(res);
    }
};

export const getAllSoundEffect = async (req, res) => {
    try {
        const response = await services.soundEffect.getAllSoundEffect(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all soundEffect controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificSoundEffect = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.soundEffect.getSpecificSoundEffect({ id });

        // Nếu soundEffect không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'SoundEffect not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific soundEffect controller:', error);
        return internalServerError(res);
    }
};

export const updateSoundEffect = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // const { error } = joi.object({ Title, Description }).validate(req.body);
        // if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.soundEffect.updateSoundEffect({ id, data }, req.file);

        // Nếu soundEffect không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'SoundEffect not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in update soundEffect controller:', error);
        return internalServerError(res);
    }
}

export const deleteSoundEffect = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.soundEffect.deleteSoundEffect({ id });

        // Nếu soundEffect không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'SoundEffect not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in delete soundEffect controller:', error);
        return internalServerError(res);
    }
}


