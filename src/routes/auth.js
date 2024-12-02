import { auth } from '../controllers/index.js';
import express from 'express';
import { accessToken } from '../middleware/authToken.js';

const router = express.Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/refreshAccessToken', auth.refreshAccessToken);
router.post('/logOut', accessToken, auth.logOut);
router.post('/resetPassword', accessToken, auth.resetPassword);
router.post('/forgetPassword', auth.forgetPassword);

export default router;
