import { playlist } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';

const router = express.Router();

router.get('/getAllPlaylist', authenticateToken, playlist.getAllPlaylist);

export default router;
