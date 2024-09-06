import { playlist } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';

const router = express.Router();

router.get('/getAllPlaylist', playlist.getAllPlaylist);
router.get('/getSpecificPlaylist/:id', playlist.getSpecificPlaylist);
router.post('/createPlaylist', authenticateToken, playlist.createPlaylist);
router.put('/updatePlaylist/:id', authenticateToken, playlist.updatePlaylist);
router.delete('/deletePlaylist/:id', authenticateToken, playlist.deletePlaylist);


export default router;
