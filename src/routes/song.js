import { song } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import { checkPermission } from '../middleware/checkPermission.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/createSong/:idPlaylist', checkPermission, upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }]
), song.createSong);
router.get('/getAllSongPlaylist/:id', accessToken, song.getAllSong);
router.get('/getAllSong', accessToken, song.getAllSong);
router.get('/getSpecificSong/:idPlaylist/:id', song.getSpecificSong);
router.get('/getNewSong', accessToken, song.getNewSong);
router.put('/updateSong/:idPlaylist/:id', checkPermission, upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }]
), song.updateSong);
router.delete('/deleteSong/:idPlaylist/:id', checkPermission, song.deleteSong);

router.get('/playSong/:id', accessToken, song.playSong);

export default router;
