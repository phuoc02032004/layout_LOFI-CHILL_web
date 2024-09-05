import express from 'express';
import { notFound } from '../middleware/handle_error.js';
import auth from './auth.js';
import user from './users.js';
import playlist from './playlist.js';


const router = express.Router();


const initRoutes = (app) => {
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/user', user);
  app.use('/api/v1/playlist', playlist);
  app.use(notFound);
};

export default initRoutes;
