const express = require('express');
const router = express.Router();
const Album = require('../models/Album');

// GET all albums
router.get('/', async (req, res) => {
    try {
        const albums = await Album.find();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching albums' });
    }
});

// GET a specific album
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }
        res.json(album);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching album' });
    }
});

// POST a new album
router.post('/', async (req, res) => {
    try {
        const newAlbum = new Album(req.body);
        const savedAlbum = await newAlbum.save();
        res.status(201).json(savedAlbum);
    } catch (err) {
        res.status(400).json({ error: 'Error creating album' });
    }
});

// PUT (update) an album
router.put('/:id', async (req, res) => {
    try {
        const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAlbum) {
            return res.status(404).json({ error: 'Album not found' });
        }
        res.json(updatedAlbum);
    } catch (err) {
        res.status(400).json({ error: 'Error updating album' });
    }
});

// DELETE an album
router.delete('/:id', async (req, res) => {
    try {
        const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
        if (!deletedAlbum) {
            return res.status(404).json({ error: 'Album not found' });
        }
        res.json({ message: 'Album deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting album' });
    }
});

module.exports = router;