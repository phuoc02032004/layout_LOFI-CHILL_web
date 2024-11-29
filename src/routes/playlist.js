import { playlist } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';

const router = express.Router();

router.post('/createPlaylist', accessToken, playlist.createPlaylist);
router.get('/getAllPlaylist', playlist.getAllPlaylist);
router.get('/getSpecificPlaylist/:id', playlist.getSpecificPlaylist);
router.put('/updatePlaylist/:id', accessToken, playlist.updatePlaylist);
router.delete('/deletePlaylist/:id', accessToken, playlist.deletePlaylist);


export default router;
