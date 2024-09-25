import express from 'express';
import { notFound } from '../middleware/handle_error.js';
import auth from './auth.js';
import user from './users.js';
import playlist from './playlist.js';
import song from './song.js'
import visual from './visual.js'
import soundEffect from './soundEffect.js'
// import { vnpay } from './vnpay.js'
import  zaloPay  from './zaloPay.js'

const router = express.Router();


const initRoutes = (app) => {
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/user', user);
  app.use('/api/v1/playlist', playlist);
  app.use('/api/v1/song', song);
  app.use('/api/v1/visual', visual);
  app.use('/api/v1/soundEffect', soundEffect);
  // app.use('/api/v1/vnpay', vnpay);
  app.use('/api/v1/zaloPay', zaloPay);

  app.use(notFound);
};

export default initRoutes;
