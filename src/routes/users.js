import { user } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';

const router = express.Router();

router.get('/getAllUser', user.getAllUser);
router.get('/getSpecificUser/:id', user.getSpecificUser);
router.put('/updateUser/:id', authenticateToken, user.updateUser);
router.delete('/deleteUser/:id', authenticateToken, user.deleteUser);

export default router;
