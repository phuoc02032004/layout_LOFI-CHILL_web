import { playlist } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';

const router = express.Router();

router.post('/createPlaylist', playlist.createPlaylist);
router.get('/getAllPlaylist', playlist.getAllPlaylist);
router.get('/getSpecificPlaylist/:id', playlist.getSpecificPlaylist);
router.put('/updatePlaylist/:id', playlist.updatePlaylist);
router.delete('/deletePlaylist/:id', playlist.deletePlaylist);


export default router;
