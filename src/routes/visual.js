import { visual } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/getAllFolderVisual', visual.getAllFolderVisual);
router.get('/getSpecificFolderVisual/:id', visual.getSpecificFolderVisual);
router.post('/createFolderVisual', visual.createFolderVisual);
router.put('/updateFolderVisual/:id', visual.updateFolderVisual);
router.delete('/deleteFolderVisual/:id', visual.deleteFolderVisual);
router.post('/createVisual/:idFolderVisual', upload.fields([
    { name: 'image', maxCount: 1 }, // Tên trường cho ảnh
    { name: 'video', maxCount: 1 }  // Tên trường cho video
]), visual.createVisual);

router.get('/getAllVisual/:idFolderVisual', visual.getAllVisual);
router.get('/getSpecificVisual/:idFolderVisual/:id', visual.getSpecificVisual);
router.delete('/deleteVisual/:idFolderVisual/:id', visual.deleteVisual);
router.put('/updateVisual/:idFolderVisual/:id', visual.updateVisual);


export default router;