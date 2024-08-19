const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// GET all playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching playlists' });
    }
});

// GET a specific playlist
router.get('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching playlist' });
    }
});

// POST a new playlist
router.post('/', async (req, res) => {
    try {
        const newPlaylist = new Playlist(req.body);
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(savedPlaylist);
    } catch (err) {
        res.status(400).json({ error: 'Error creating playlist' });
    }
});

// PUT (update) a playlist
router.put('/:id', async (req, res) => {
    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlaylist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json(updatedPlaylist);
    } catch (err) {
        res.status(400).json({ error: 'Error updating playlist' });
    }
});

// DELETE a playlist
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
        if (!deletedPlaylist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json({ message: 'Playlist deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting playlist' });
    }
});

module.exports = router;