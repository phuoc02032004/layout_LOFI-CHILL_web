import * as services from '../services/index.js';
import { internalServerError } from '../middleware/handle_error.js';

export const getAllPlaylist = async (req, res) => {
    try {
        const response = await services.playlist.getAllPlaylist(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in get all playlist controller:', error);
        return internalServerError(res);
    }
};