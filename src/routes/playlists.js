const express = require('express');
const router = express.Router();
// const Playlist = require('../models/Playlist');
const admin = require('firebase-admin');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const db = admin.firestore();

// Cấu hình CORS cho phép OPTIONS
router.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// GET all playlists
router.get('/getInforPlaylist', async (req, res) => {
    try {
        const playlistsSnapshot = await db.collection('Music').get();
        const playlist = playlistsSnapshot.docs.map(doc => doc.data());
        res.json(playlist);
    } catch (err) {
        console.error("Error fetching playlists:", err);
        res.status(500).json({ error: 'Error fetching playlists' });
    }
});

// GET a specific playlist
// router.get('/:id', async (req, res) => {
//     try {
//         const playlist = await Playlist.findById(req.params.id);
//         if (!playlist) {
//             return res.status(404).json({ error: 'Playlist not found' });
//         }
//         res.json(playlist);
//     } catch (err) {
//         res.status(500).json({ error: 'Error fetching playlist' });
//     }
// });

// POST a new playlist
router.post('/createPlaylist', async (req, res) => {
    try {
        const { Title, Description } = req.body;

        // Kiểm tra xem tất cả các trường có giá trị không
        if (!Title || !Description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Kiểm tra xem playlist đã tồn tại chưa
        const playlistsRef = db.collection('Music');
        const snapshot = await playlistsRef.where('Title', '==', Title).get();

        if (!snapshot.empty) {
            return res.status(400).json({ error: 'Playlist with this title already exists' });
        }

        // Tạo playlist mới trong Firestore
        const newPlaylistRef = playlistsRef.doc();
        await newPlaylistRef.set({
            Title,
            Description,
        });

        // Tạo thư mục mới trong Firebase Storage dựa trên title
        const bucket = storage.bucket(process.env.BUCKET);
        const folderName = `Music/${Title}/`;
        const file = bucket.file(folderName + '.keep');

        // Tạo một file trống để đảm bảo thư mục được tạo
        await file.save('');

        res.status(201).json({ message: 'Playlist created successfully and folder created in Storage.' });
    } catch (err) {
        console.error("Error creating playlist:", err.message);  // Ghi lại lỗi vào console
        res.status(400).json({ error: 'Error creating playlist', details: err.message });
    }
});

// PUT (update) a playlist
router.put('/updatePlaylist/:id', async (req, res) => {
    try {
        const playlistId = req.params.id;
        const { Title, Description } = req.body;

        const playlistRef = db.collection('Music').doc(playlistId);

        const playlistSnapshot = await playlistRef.get();
        if (!playlistSnapshot.exists) {
            return res.status(400).json({ error: 'Playlist with this ID does not exist' });
        }

        await playlistRef.update({
            Title,
            Description
        })


        res.json({ message: 'updated successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error updating playlist' });
    }
});

// DELETE a playlist
router.delete('/deletePlaylist/:id', async (req, res) => {
    try {
        const playlistId = req.params.id;
        const playlistRef = db.collection('Music').doc(playlistId);
        const playlistSnapshot = await playlistRef.get();
        if (!playlistSnapshot.exists) {
            return res.status(400).json({ error: 'Playlist with this ID does not exist' });
        }
        await playlistRef.delete();

        res.json({ message: 'Playlist deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting playlist' });
    }
});

module.exports = router;