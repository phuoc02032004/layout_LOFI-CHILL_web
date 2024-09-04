import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import initRoutes from './routes/index.js';
import serviceAccount from '../music-52602-firebase-adminsdk-fax9b-0d8089b84a.json' assert { type: 'json' };

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

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
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

const PORT = process.env.PORT || 8888;

const listener = app.listen(PORT, () => {
  console.log('Server is running on the port ' + listener.address().port);
});

export default app;
