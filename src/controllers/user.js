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

        // Kiểm tra ID có tồn tại không
        if (!id) {
            return res.status(400).json({
                err: 1,
                mes: 'User ID is required',
            });
        }

        const response = await services.user.getSpecificUser({ id });
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get specific user controller:', error);
        return internalServerError(res);
    }
};