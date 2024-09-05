import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';
import joi from 'joi'
import { id } from '../helper/joi_schema.js';

export const getAllUser = async (req, res) => {
    try {
        const response = await services.user.getAllUser(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all user controller:', error);
        return internalServerError(res);
    }
};

export const getSpecificUser = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.user.getSpecificUser({ id });

        // Nếu user không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'User not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific user controller:', error);
        return internalServerError(res);
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy dữ liệu từ req.body để cập nhật người dùng
        const data = req.body;

        const response = await services.user.updateUser({ id, data });

        // Nếu user không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'User not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in update user controller:', error);
        return internalServerError(res);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await services.user.deleteUser({ id });

        // Nếu user không được tìm thấy
        if (response.status === 404) {
            return res.status(404).json({
                err: 1,
                mes: 'User not found',
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in delete user controller:', error);
        return internalServerError(res);
    }
};