import { email, password, username } from '../helper/joi_schema.js';
import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';
import joi from 'joi'

export const register = async (req, res) => {
    try {
        const { error } = joi.object({ username, email, password }).validate(req.body);
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
        const { email, code } = req.body;
        const response = await services.auth.verify({ email, code });
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in verify controller:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = joi.object({ email: joi.string().email().required(), password: joi.string().required() }).validate(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const response = await services.auth.login(req.body);
            return res.status(200).json(response); // Thành công trả về status 200
        } catch (loginError) {
            return res.status(loginError.status || 500).json({ error: loginError.error || 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error in log in controller:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

