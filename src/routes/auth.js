import { auth } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.post('/register', auth.register);
// router.post('/verify', auth.verify);
router.post('/login', auth.login);
router.post('/refreshToken', auth.refreshToken)

export default router;
