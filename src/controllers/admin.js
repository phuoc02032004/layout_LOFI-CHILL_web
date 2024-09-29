import joi from 'joi';
import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js'; // Import middleware xử lý lỗi

// Định nghĩa hàm login
export const login = async (req, res) => {
    try {

        const { error } = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required(),
        }).validate(req.body);

        if (error) {
            console.error('Validation error:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const response = await services.admin.login(req.body);
            console.log('Login service response:', response);
            return res.status(200).json(response);
        } catch (loginError) {
            console.error('Error in login service:', loginError);
            return res.status(loginError.status || 500).json({
                error: loginError.message || 'Internal Server Error',
            });
        }
    } catch (error) {
        console.error('Error in log in controller:', error);
        return internalServerError(res, error);
    }
};
