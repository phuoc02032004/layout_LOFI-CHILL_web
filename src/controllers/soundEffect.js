import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js';
import joi from 'joi'
import { Title, Description } from '../helper/joi_schema.js';

export const getAllFolderSoundEffect = async (req, res) => {
    try {
        const response = await services.soundEffect.getAllFolderSoundEffect(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all soundEffect controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificFolderSoundEffect = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.soundEffect.getSpecificFolderSoundEffect({ id });

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

export const createFolderSoundEffect = async (req, res) => {
    try {
        const { error } = joi.object({ Title, Description }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.soundEffect.createFolderSoundEffect(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create soundEffect controller:', error);
        return internalServerError(res);
    }
};

export const deleteFolderSoundEffect = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.soundEffect.deleteFolderSoundEffect({ id });

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

export const updateFolderSoundEffect = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // const { error } = joi.object({ Title, Description }).validate(req.body);
        // if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.soundEffect.updateFolderSoundEffect({ id, data });

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

export const createSoundEffect = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = joi.object({ Title, Description }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        if (!id) return res.status(400).json({ error: 'Folder ID is required' });
        if (!req.file) return res.status(400).json({ error: 'Sound file is required' });

        const response = await services.soundEffect.createSoundEffect({ idFolder: id, ...req.body }, req.file);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create soundEffect controller:', error);
        return internalServerError(res);
    }
};
