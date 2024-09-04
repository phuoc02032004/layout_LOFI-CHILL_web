import { email, password, username } from '../helper/joi_schema.js';
import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';
import joi from 'joi'

export const register = async (req, res) => {
    try {
        const { error } = joi.object({ email, password, username }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.auth.register(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in register controller:', error);
        return internalServerError(res);
    }
};


export const verify = async (req, res) => {
    try {
        const { email, code } = req.body; // Đảm bảo lấy từ req.body nếu cần
        const response = await services.verify(email, code);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
}

export const login = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const response = await services.auth.login(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in log in controller:', error);
        return internalServerError(res);
    }
}
