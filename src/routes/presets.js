import { presets } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.post('/createPreset', presets.createPreset);
router.get('/getAllPresets', presets.getAllPresets);
router.get('/getSpecificPreset/:id', presets.getSpecificPreset);
router.put('/updatePreset/:id', presets.updatePreset);
router.delete('/deletePreset/:id', presets.deletePreset);

export default router;
