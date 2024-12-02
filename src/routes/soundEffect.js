import { soundEffect } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/createSoundEffect', accessToken, upload.single('soundFile'), soundEffect.createSoundEffect);
router.get('/getAllSoundEffect', accessToken, soundEffect.getAllSoundEffect);
router.get('/getSpecificSoundEffect/:id', accessToken, soundEffect.getSpecificSoundEffect);
router.put('/updateSoundEffect/:id', accessToken, upload.single('soundFile'), soundEffect.updateSoundEffect);
router.delete('/deleteSoundEffect/:id', accessToken, soundEffect.deleteSoundEffect);

export default router;
