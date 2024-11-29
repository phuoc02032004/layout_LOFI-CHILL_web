import { artist } from "../controllers/index.js";
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const router = express.Router();
const upload = multer({ storage });


router.post('/createArtist', accessToken, upload.single('fileImg'), artist.createArtist);
router.get('/getAllArtist', artist.getAllArtist);
router.get('/getSpecificArtist/:id', artist.getSpecificArtist);
router.put('/updateArtist/:id', accessToken, upload.single('fileImg'), artist.updateArtist);
router.delete('/deleteArtist/:id', accessToken, artist.deleteArtist);
router.get('/getArtistSong/:id', artist.getArtistSong);

export default router;