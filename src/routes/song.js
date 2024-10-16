import { song } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/createSong/:idPlaylist', upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }]
), song.createSong);
router.get('/getAllSong/:id', song.getAllSong);
router.get('/getSpecificSong/:idPlaylist/:id', song.getSpecificSong);
router.get('/getNewSong', song.getNewSong);
router.put('/updateSong/:idPlaylist/:id', upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }]
), song.updateSong);
router.delete('/deleteSong/:idPlaylist/:id', song.deleteSong);

router.get('/playSong/:id', song.playSong);

export default router;
