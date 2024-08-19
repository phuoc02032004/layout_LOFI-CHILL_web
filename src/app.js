const express = require('express');
const admin = require('firebase-admin');
const usersRouter = require('./routes/users');
const visualsRouter = require('./routes/visuals');
const app = express();

const serviceAccount = require('./music-52602-firebase-adminsdk-fax9b-0d8089b84a.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'music-52602.appspot.com'
  });
}

const db = admin.firestore();

// Middleware để xử lý JSON request
app.use(express.json());

// Sử dụng route cho API
app.use('/users', usersRouter);
app.use('/visuals', visualsRouter);

// Xuất ứng dụng Express
module.exports = app;
