import { presets } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';

const router = express.Router();

router.post('/createPreset', accessToken, presets.createPreset);
router.get('/getAllPresets', presets.getAllPresets);
router.get('/getSpecificPreset/:id', presets.getSpecificPreset);
router.put('/updatePreset/:id', accessToken, presets.updatePreset);
router.delete('/deletePreset/:id', accessToken, presets.deletePreset);

export default router;
