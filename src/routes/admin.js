import { admin } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.post('/login', admin.login);

export default router;
