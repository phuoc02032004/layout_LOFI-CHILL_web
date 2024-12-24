import { user } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import { checkPermission } from '../middleware/checkPermission.js';

const router = express.Router();

router.get('/getAllUser', accessToken, user.getAllUser);
router.get('/getSpecificUser/:id', accessToken, user.getSpecificUser);
router.put('/updateUser/:id', checkPermission, user.updateUser);
router.delete('/deleteUser/:id', checkPermission, user.deleteUser);

export default router;
