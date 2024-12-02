import { user } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';

const router = express.Router();

router.get('/getAllUser', accessToken, user.getAllUser);
router.get('/getSpecificUser/:id', accessToken, user.getSpecificUser);
router.put('/updateUser/:id', accessToken, user.updateUser);
router.delete('/deleteUser/:id', accessToken, user.deleteUser);

export default router;
