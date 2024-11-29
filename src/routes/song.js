import { song } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import multer from 'multer';
import { getNewSong } from '../services/song.js';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/createSong/:idPlaylist', accessToken, upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }]
), song.createSong);
router.get('/getAllSongPlaylist/:id', song.getAllSong);
router.get('/getAllSong', song.getAllSong);
router.get('/getSpecificSong/:idPlaylist/:id', song.getSpecificSong);
router.get('/getNewSong', accessToken, song.getNewSong);
router.put('/updateSong/:idPlaylist/:id', accessToken, upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }]
), song.updateSong);
router.delete('/deleteSong/:idPlaylist/:id', accessToken, song.deleteSong);

router.get('/playSong/:id', song.playSong);

export default router;
