import { song } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get('/getAllSong/:id', song.getAllSong);
router.get('/getSpecificSong/:idPlaylist/:id', song.getSpecificSong);
router.post('/createSong/:idPlaylist', upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }]
), song.createSong);
router.delete('/deleteSong/:idPlaylist/:id', song.deleteSong);
router.put('/updateSong/:idPlaylist/:id', song.updateSong);

export default router;
