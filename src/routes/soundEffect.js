import { soundEffect } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import { checkPermission } from '../middleware/checkPermission.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/createSoundEffect', checkPermission, upload.single('soundFile'), soundEffect.createSoundEffect);
router.get('/getAllSoundEffect', accessToken, soundEffect.getAllSoundEffect);
router.get('/getSpecificSoundEffect/:id', accessToken, soundEffect.getSpecificSoundEffect);
router.put('/updateSoundEffect/:id', checkPermission, upload.single('soundFile'), soundEffect.updateSoundEffect);
router.delete('/deleteSoundEffect/:id', checkPermission, soundEffect.deleteSoundEffect);

export default router;
