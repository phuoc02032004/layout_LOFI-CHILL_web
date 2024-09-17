import { soundEffect } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get('/getAllFolderSoundEffect', soundEffect.getAllFolderSoundEffect);
router.get('/getSpecificFolderSoundEffect/:id', soundEffect.getSpecificFolderSoundEffect);
router.post('/createFolderSoundEffect', soundEffect.createFolderSoundEffect);
router.post('/createSoundEffect/:id', upload.single('file'), soundEffect.createSoundEffect);
router.delete('/deleteFolderSoundEffect/:id', soundEffect.deleteFolderSoundEffect);
router.put('/updateFolderSoundEffect/:id', soundEffect.updateFolderSoundEffect);

export default router;
