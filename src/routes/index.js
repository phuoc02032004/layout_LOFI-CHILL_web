import express from 'express';
import auth from './auth.js';
import { notFound } from '../middleware/handle_error.js';
import user from './users.js';

const router = express.Router();


const initRoutes = (app) => {
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/user', user)
  app.use(notFound)
};

export default initRoutes;
