import { user } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.get('/getAllUser', user.getAllUser);
router.get('/getSpecificUser/:id', user.getSpecificUser);


export default router;
