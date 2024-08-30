const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { Timestamp } = require('firebase-admin/firestore');

// Lấy bucket đã được cấu hình sẵn trong Firebase Admin SDK
const bucket = admin.storage().bucket(process.env.BUCKET);
const db = admin.firestore();

// Cấu hình multer để lưu trữ file trong bộ nhớ trước khi upload lên Firebase
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

router.get('/getVisuals', async (req, res) => {
  try {
    const [files] = await bucket.getFiles({ prefix: 'Visuals/' });
    const videoUrls = await Promise.all(files.map(async (file) => {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491' // Đặt ngày hết hạn URL
      });
      return {
        name: file.name,
        url
      };
    }));
    res.status(200).json(videoUrls);
  } catch (error) {
    console.error('Error retrieving videos:', error);
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
});

// POST Visuals
router.post('/postVisuals', upload.single('file'), async (req, res) => {
  try {
    const { Title, createdAt, updateAt } = req.body;

    // Ktra 
    if (!Title || !createdAt || !updateAt) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: {
          Title: !Title ? "Title is required" : null,
          createdAt: !createdAt ? "createdAt is required" : null,
          updateAt: !updateAt ? "updateAt is required" : null
        }
      });
    }

    const VisualRef = db.collection('Visuals');
    // Chuyển đổi `createdAt` và `updatedAt` sang Firestore Timestamp
    const createdAtTimestamp = Timestamp.fromDate(new Date(createdAt));
    const updatedAtTimestamp = Timestamp.fromDate(new Date(updateAt));

    //Upload file vao FS
    const file = req.file;
    const fileName = `Visuals/${uuidv4()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    //Tai file len Storage
    await fileUpload.save(file.buffer);

    //Lay Url tu Storage
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });

    //Them Visual vao Firestore
    await VisualRef.add({
      Title,
      Url: url,
      filePath: fileName,
      createdAt: createdAtTimestamp,
      updatedAt: updatedAtTimestamp,
    });
    res.status(201).json({ message: 'Visual created successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating visual', details: error.message });
  }
});

// Delete
router.delete('/deleteVisual/:id', async (req, res) => {
  try {
    const visualId = req.params.id;
    const visualRef = db.collection('Visuals').doc(visualId);

    //Lay thong tin Visuals de xoa trong Storage
    const visualDoc = await visualRef.get();
    if (!visualDoc.exists) {
      return res.status(404).json({ error: 'Visual not found' });
    }

    const visualData = visualDoc.data();
    const filePath = visualData.filePath;

    if (!filePath) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    //Xoa file tu Storage
    const file = bucket.file(filePath);
    await file.delete();

    //Xoa khoi Firebase
    await visualRef.delete();

    res.json({ message: 'Visual deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Visuals', details: err.message });
  }
});

module.exports = router;
