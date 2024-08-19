const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// GET all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching songs' });
    }
});

// GET a specific song
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json(song);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching song' });
    }
});

// POST a new song
router.post('/', async (req, res) => {
    try {
        const newSong = new Song(req.body);
        const savedSong = await newSong.save();
        res.status(201).json(savedSong);
    } catch (err) {
        res.status(400).json({ error: 'Error creating song' });
    }
});

// PUT (update) a song
router.put('/:id', async (req, res) => {
    try {
        const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSong) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json(updatedSong);
    } catch (err) {
        res.status(400).json({ error: 'Error updating song' });
    }
});

// DELETE a song
router.delete('/:id', async (req, res) => {
    try {
        const deletedSong = await Song.findByIdAndDelete(req.params.id);
        if (!deletedSong) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json({ message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting song' });
    }
});

module.exports = router;