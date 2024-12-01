import { internalServerError } from '../middleware/handle_error.js';
import * as services from '../services/index.js';
import joi from 'joi'

export const addHistory = async (req, res) => {
    try {
        const { userId, playlistId, songId } = req.body;
        const { error } = joi.object({ userId, playlistId, songId }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        console.log('Received data:', { userId, playlistId, songId });

        const response = await services.history.addHistory({ userId, playlistId, songId });
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error adding history:', error);
        return internalServerError(res, 'Failed to add history.');
    }
};

export const getHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        const { error } = joi.object({ userId }).validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const response = await services.history.getHistory({ userId });
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error Get history:', error);
        return internalServerError(res, 'Failed to get history.');
    }
};
