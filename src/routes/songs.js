const express = require('express');
const router = express.Router();
// const Song = require('../models/Song');
const admin = require('firebase-admin');

const db = admin.firestore();

const { Timestamp } = require('firebase-admin').firestore;


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
router.post('/createSongs/:id', async (req, res) => {
    try {
        const { Artist, Title, Url, createdAt, updatedAt } = req.body;
        // Kiểm tra xem tất cả các trường có giá trị không
        if (!Artist || !Title || !Url || !createdAt || !updatedAt) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const musicId = req.params.id;
        const songRef = db.collection('Music').doc(musicId).collection('Songs');

        // Chuyển đổi `createdAt` và `updatedAt` sang Firestore Timestamp
        const createdAtTimestamp = Timestamp.fromDate(new Date(createdAt));
        const updatedAtTimestamp = Timestamp.fromDate(new Date(updatedAt));

        // Sử dụng phương thức `add()` để thêm bài hát mới
        await songRef.add({
            Artist,
            Title,
            Url,
            createdAt: createdAtTimestamp,
            updatedAt: updatedAtTimestamp,
        });

        res.status(201).json({ message: 'Song created successfully.' });
    } catch (err) {
        res.status(400).json({ error: 'Error creating song', details: err.message });
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

// DELETE a song
router.delete('/deleteSongs/:idPlaylist/:id', async (req, res) => {
    try {
        const playlistId = req.params.idPlaylist;
        const musicId = req.params.id;
        const songRef = db.collection('Music').doc(playlistId).collection('Songs').doc(musicId);
        await songRef.delete();
        res.json({ message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting song' });
    }
});

module.exports = router;