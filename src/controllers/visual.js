import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';
import joi from 'joi'
import { Title } from '../helper/joi_schema.js';


export const getAllFolderVisual = async (req, res) => {
    try {
        const response = await services.visual.getAllFolderVisual(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all folder visual controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificFolderVisual = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.visual.getSpecificFolderVisual({ id });

        // Nếu Folder Visual không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Folder Visual not found',
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific folder visual controller:', error);
        return internalServerError(res);
    }
};

export const createFolderVisual = async (req, res) => {
    try {
        const { error } = joi.object({ Title }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.visual.createFolderVisual(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in create Folder Visual controller:', error);
        return internalServerError(res);
    }
};

export const updateFolderVisual = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy dữ liệu từ req.body để cập nhật
        const data = req.body;

        const response = await services.visual.updateFolderVisual({ id, data });

        // Nếu Folder Visual không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Folder Visual not found',
            });
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in update Folder Visual controller:', error);
        return internalServerError(res);
    }
};

export const deleteFolderVisual = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.visual.deleteFolderVisual({ id });

        // Nếu Folder Visual không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'Folder Visual not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in delete Folder Visual controller:', error);
        return internalServerError(res);
    }
};

export const createVisual = async (req, res) => {
    try {
        const { idFolderVisual } = req.params;
        const { Title } = req.body;

        if (!idFolderVisual) {
            return res.status(400).json({
                err: 1,
                mes: 'Folder Visual ID is required',
            });
        }

        // Kiểm tra các tệp đã được tải lên
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
            { idFolderVisual, Title },
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
        const { idFolderVisual } = req.params;

        // Kiểm tra nếu id không tồn tại
        if (!idFolderVisual) {
            return res.status(404).json({
                err: 1,
                mes: 'Folder Visual ID is required',
            });
        }

        const response = await services.visual.getAllVisual({ idFolderVisual });

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
        const { idFolderVisual, id } = req.params;

        const response = await services.visual.getSpecificVisual({ idFolderVisual, id });

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

export const deleteVisual = async (req, res) => {
    try {
        const { idFolderVisual, id } = req.params;

        const response = await services.visual.deleteVisual({ idFolderVisual, id });

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

export const updateVisual = async (req, res) => {
    try {
        const { idFolderVisual } = req.params;

        const { id } = req.params;

        const data = req.body;

        const response = await services.visual.updateVisual({ idFolderVisual, id, data });

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