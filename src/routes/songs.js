const express = require('express');
const router = express.Router();
const multer = require('multer');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const { Timestamp } = require('firebase-admin/firestore');

const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.BUCKET);

// Cấu hình multer
const upload = multer();


// GET all songs
router.get('/getSongs/:id', async (req, res) => {
    try {
        const musicId = req.params.id;
        const songRef = db.collection('Music').doc(musicId).collection('Songs');
        const snapshot = await songRef.get();

        if (snapshot.empty) {
            return res.status(404).send('No songs found.');
        }

        let songs = [];
        snapshot.forEach(doc => {
            songs.push({ id: doc.id, ...doc.data() });
        })

        res.status(200).json(songs);

    } catch (err) {
        res.status(500).json({ error: 'Error fetching songs' });
    }
});

// GET a specific song
router.get('/getSpecificSongs/:idPlaylist/:id', async (req, res) => {
    try {
        const playlistId = req.params.idPlaylist;
        const musicId = req.params.id;
        const songRef = db.collection('Music').doc(playlistId).collection('Songs').doc(musicId);
        const doc = await songRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'not found' });
        }
        res.json(doc.data());
    } catch (err) {
        res.status(500).json({ error: 'Error fetching song' });
    }
});


// POST a new song
router.post('/createSong/:id', upload.single('file'), async (req, res) => {
    try {
        const { Artist, Title, createdAt, updatedAt } = req.body;

        // Kiểm tra xem tất cả các trường có giá trị không
        if (!Artist || !Title || !createdAt || !updatedAt) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const musicId = req.params.id;
        const songRef = db.collection('Music').doc(musicId).collection('Songs');

        //Lay ten cua playlist
        const playlistRef = db.collection('Music').doc(musicId);
        const playlistDoc = await playlistRef.get();
        if (!playlistDoc.exists) {
            return res.status(404).json({ error: 'Song not found' });
        }
        const playlistName = playlistDoc.data().Title;

        // Chuyển đổi `createdAt` và `updatedAt` sang Firestore Timestamp
        const createdAtTimestamp = Timestamp.fromDate(new Date(createdAt));
        const updatedAtTimestamp = Timestamp.fromDate(new Date(updatedAt));

        // Upload file vào Firebase Storage
        const file = req.file;  // Multer sẽ gắn file vào `req.file`
        const filename = `Music/${playlistName}/${uuidv4()}_${file.originalname}`;
        const fileUpload = bucket.file(filename);

        // Tải file lên Storage
        await fileUpload.save(file.buffer);

        // Lấy URL của file từ Storage
        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Thời gian hết hạn của URL (có thể thay đổi)
        });

        // Sử dụng phương thức `add()` để thêm bài hát mới vào Firestore
        await songRef.add({
            Artist,
            Title,
            Url: url,
            filePath: filename, // Lưu đường dẫn file để xóa file
            createdAt: createdAtTimestamp,
            updatedAt: updatedAtTimestamp,
        });

        res.status(201).json({ message: 'Song created successfully.', playlistName: playlistName });
    } catch (err) {
        res.status(400).json({ error: 'Error creating song', details: err.message });
    }
});

// DELETE a song
router.delete('/deleteSong/:idPlaylist/:id', async (req, res) => {
    try {
        const playlistId = req.params.idPlaylist;
        const musicId = req.params.id;
        const songRef = db.collection('Music').doc(playlistId).collection('Songs').doc(musicId);

        // Lấy thông tin bài hát từ Firestore
        const songDoc = await songRef.get();
        if (!songDoc.exists) {
            return res.status(404).json({ error: 'Song not found' });
        }

        const songData = songDoc.data();
        const filePath = songData.filePath;

        if (!filePath) {
            return res.status(400).json({ error: 'Invalid file path' });
        }

        // Xóa file từ Firebase Storage
        const file = bucket.file(filePath);
        await file.delete();

        // Xóa bài hát khỏi Firestore
        await songRef.delete();

        res.json({ message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting song', details: err.message });
    }
});

// // PUT (update) a song
router.put('/updateSongs/:idPlaylist/:id', async (req, res) => {
    try {
        const playlistId = req.params.idPlaylist;
        const musicId = req.params.id;
        const { Artist, Title, Url, updatedAt } = req.body;
        const songRef = db.collection('Music').doc(playlistId).collection('Songs').doc(musicId);

        // Chuyển đổi `updatedAt` sang Firestore Timestamp
        const updatedAtTimestamp = Timestamp.fromDate(new Date(updatedAt));

        // Cập nhật các trường của bài hát
        await songRef.update({
            Artist,
            Title,
            Url,
            updatedAt: updatedAtTimestamp,
        });
        res.json({ message: 'updated successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error updating song' });
    }
});


module.exports = router;