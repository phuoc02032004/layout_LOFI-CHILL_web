import { history } from "../controllers/index.js";
import express from 'express';
import { accessToken } from '../middleware/authToken.js';
import multer from 'multer';
const router = express.Router();

router.post('/addHistory',accessToken, history.addHistory);
router.get('/getHistory', accessToken,history.getHistory);

export default router;
