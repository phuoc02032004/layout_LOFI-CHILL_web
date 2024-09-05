import { user } from '../controllers/index.js';
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';

const router = express.Router();

router.get('/getAllUser', authenticateToken, user.getAllUser);
router.get('/getSpecificUser/:id', authenticateToken, user.getSpecificUser);
router.put('/updateUser/:id', authenticateToken, user.updateUser);
router.delete('/deleteUser/:id', authenticateToken, user.deleteUser);

export default router;
