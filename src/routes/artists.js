const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');

// GET all artists
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching artists' });
    }
});

// GET a specific artist
router.get('/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        res.json(artist);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching artist' });
    }
});

// POST a new artist
router.post('/', async (req, res) => {
    try {
        const newArtist = new Artist(req.body);
        const savedArtist = await newArtist.save();
        res.status(201).json(savedArtist);
    } catch (err) {
        res.status(400).json({ error: 'Error creating artist' });
    }
});

// PUT (update) an artist
router.put('/:id', async (req, res) => {
    try {
        const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedArtist) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        res.json(updatedArtist);
    } catch (err) {
        res.status(400).json({ error: 'Error updating artist' });
    }
});

// DELETE an artist
router.delete('/:id', async (req, res) => {
    try {
        const deletedArtist = await Artist.findByIdAndDelete(req.params.id);
        if (!deletedArtist) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        res.json({ message: 'Artist deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting artist' });
    }
});

module.exports = router;