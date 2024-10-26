import { user } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';

const router = express.Router();

router.get('/getAllUser', user.getAllUser);
router.get('/getSpecificUser/:id', user.getSpecificUser);
router.put('/updateUser/:id', user.updateUser);
router.delete('/deleteUser/:id', user.deleteUser);

export default router;
