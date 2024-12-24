import { playlist } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post('/createPlaylist', checkPermission, playlist.createPlaylist);
router.get('/getAllPlaylist', accessToken, playlist.getAllPlaylist);
router.get('/getSpecificPlaylist/:id', accessToken, playlist.getSpecificPlaylist);
router.put('/updatePlaylist/:id', checkPermission, playlist.updatePlaylist);
router.delete('/deletePlaylist/:id', checkPermission, playlist.deletePlaylist);


export default router;
