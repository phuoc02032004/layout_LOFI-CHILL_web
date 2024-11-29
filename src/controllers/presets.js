import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js';
import joi from 'joi';
import { Title, Description, playlistId, visualId, sounds, vip } from '../helper/joi_schema.js';

// Create a new preset
export const createPreset = async (req, res) => {
    try {
        const { error } = joi.object({
            Title, Description, playlistId, visualId, sounds, vip
        }).validate(req.body);

        if (error) {
            console.error('Validation error:', error.details);
            return res.status(400).json({ error: error.details[0].message });
        }

        const response = await services.presets.createPreset({ ...req.body });

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in createPreset controller:', error);
        return internalServerError(res);
    }
};


// Get all presets
export const getAllPresets = async (req, res) => {
    try {
        const response = await services.presets.getAllPresets();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in getAllPresets controller:', error);
        return internalServerError(res);
    }
};

// Get specific preset by ID
export const getSpecificPreset = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.presets.getSpecificPreset({ id });

        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Preset not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in getSpecificPreset controller:', error);
        return internalServerError(res);
    }
};

// Update a preset
export const updatePreset = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Gọi dịch vụ cập nhật preset
        const response = await services.presets.updatePreset({ presetId: id, ...data });

        // Kiểm tra nếu không tìm thấy preset
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Preset not found',
            });
        }

        // Trả về kết quả thành công
        return res.status(200).json({
            err: 0,
            mes: 'Update preset successfully',
            preset: response.preset
        });
    } catch (error) {
        console.error('Error in updatePreset controller:', error);
        return res.status(500).json({
            err: 1,
            mes: 'Error updating preset',
            error: error.message
        });
    }
};

// Delete a preset
export const deletePreset = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.presets.deletePreset({ id });

        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Preset not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in deletePreset controller:', error);
        return internalServerError(res);
    }
};
