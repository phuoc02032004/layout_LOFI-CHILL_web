import { artist } from "../controllers/index.js";
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import { checkPermission } from "../middleware/checkPermission.js";
import { apiLimiter } from "../middleware/limitRequest.js";
import multer from 'multer';
const storage = multer.memoryStorage();
const router = express.Router();
const upload = multer({ storage });


router.post('/createArtist', checkPermission, upload.single('fileImg'), artist.createArtist);
router.get('/getAllArtist', accessToken, apiLimiter, artist.getAllArtist);
router.get('/getSpecificArtist/:id', accessToken, artist.getSpecificArtist);
router.put('/updateArtist/:id', checkPermission, upload.single('fileImg'), artist.updateArtist);
router.delete('/deleteArtist/:id', checkPermission, artist.deleteArtist);
router.get('/getArtistSong/:id', accessToken, artist.getArtistSong);

export default router;