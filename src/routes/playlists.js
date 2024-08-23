const express = require('express');
const router = express.Router();
// const Playlist = require('../models/Playlist');
const admin = require('firebase-admin');
const cors = require('cors');

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
        const { title, description } = req.body;
        // Kiểm tra xem tất cả các trường có giá trị không
        if (!title || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Kiểm tra xem playlist đã tồn tại chưa
        const playlistRef = db.collection('Music').doc(title);
        const doc = await playlistRef.get();
        if (doc.exists) {
            return res.status(400).json({ error: 'Playlist already exists' });
        }

        // Tạo playlist mới
        await playlistRef.set({
            title,
            description,
        });

        res.status(201).json({ message: 'created successfully.'});
    } catch (err) {
        res.status(400).json({ error: 'Error creating playlist' });
    }
});

// // PUT (update) a playlist
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedPlaylist) {
//             return res.status(404).json({ error: 'Playlist not found' });
//         }
//         res.json(updatedPlaylist);
//     } catch (err) {
//         res.status(400).json({ error: 'Error updating playlist' });
//     }
// });

// // DELETE a playlist
// router.delete('/:id', async (req, res) => {
//     try {
//         const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
//         if (!deletedPlaylist) {
//             return res.status(404).json({ error: 'Playlist not found' });
//         }
//         res.json({ message: 'Playlist deleted' });
//     } catch (err) {
//         res.status(500).json({ error: 'Error deleting playlist' });
//     }
// });

module.exports = router;