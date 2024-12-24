import { presets } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import { checkPermission } from '../middleware/checkPermission.js';

const router = express.Router();

router.post('/createPreset', checkPermission, presets.createPreset);
router.get('/getAllPresets', accessToken, presets.getAllPresets);
router.get('/getSpecificPreset/:id', accessToken, presets.getSpecificPreset);
router.put('/updatePreset/:id', checkPermission, presets.updatePreset);
router.delete('/deletePreset/:id', checkPermission, presets.deletePreset);

export default router;
