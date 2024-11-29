import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';
import joi from 'joi'
import { Title, vip } from '../helper/joi_schema.js';

export const createVisual = async (req, res) => {
    try {

        const { Title, vip } = req.body;

        const schema = joi.object({
            Title: joi.string().required(),
            vip: joi.string().valid('true', 'false').required(),
        });

        const { error } = schema.validate({ Title, vip });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const vipBoolean = vip === 'true';

        if (!req.files || !req.files.image || !req.files.video) {
            return res.status(400).json({
                err: 1,
                mes: 'Both image and video files are required',
            });
        }

        const imageFile = req.files.image[0];
        const videoFile = req.files.video[0];

        // Gọi dịch vụ với dữ liệu tệp ảnh và video
        const response = await services.visual.createVisual(
            { Title, vip: vipBoolean },
            imageFile,
            videoFile
        );

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create Visual controller:', error);
        return internalServerError(res);
    }
};


export const getAllVisual = async (req, res) => {
    try {

        const response = await services.visual.getAllVisual({});

        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Visual not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all Visual controller:', error);
        return internalServerError(res);
    }
};


export const getSpecificVisual = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.visual.getSpecificVisual({ id });

        // Nếu Visual không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Visual not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific Visual controller:', error);
        return internalServerError(res);
    }
};

export const updateVisual = async (req, res) => {
    try {

        const { id } = req.params;

        const data = req.body;

        const imageFile = req.files?.image?.[0];
        const videoFile = req.files?.video?.[0];

        const response = await services.visual.updateVisual({ id, data }, imageFile, videoFile);

        // Nếu Visual không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Visual not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in update Visual controller:', error);
        return internalServerError(res);
    }
};

export const deleteVisual = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.visual.deleteVisual({ id });

        // Nếu Visual không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Visual not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in delete Visual controller:', error);
        return internalServerError(res);
    }
};