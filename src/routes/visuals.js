const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const cors = require('cors');


// Lấy bucket đã được cấu hình sẵn trong Firebase Admin SDK
const bucket = admin.storage().bucket(process.env.BUCKET);

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

module.exports = router;
