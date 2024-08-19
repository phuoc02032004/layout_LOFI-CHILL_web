const express = require('express');
const router = express.Router();
const Favorites = require('../models/Favorites');

// GET all favorites
router.get('/', async (req, res) => {
    try {
        const favorites = await Favorites.find();
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching favorites' });
    }
});

// GET a specific favorite
router.get('/:id', async (req, res) => {
    try {
        const favorite = await Favorites.findById(req.params.id);
        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }
        res.json(favorite);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching favorite' });
    }
});

// POST a new favorite
router.post('/', async (req, res) => {
    try {
        const newFavorite = new Favorites(req.body);
        const savedFavorite = await newFavorite.save();
        res.status(201).json(savedFavorite);
    } catch (err) {
        res.status(400).json({ error: 'Error creating favorite' });
    }
});

// DELETE a favorite
router.delete('/:id', async (req, res) => {
    try {
        const deletedFavorite = await Favorites.findByIdAndDelete(req.params.id);
        if (!deletedFavorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }
        res.json({ message: 'Favorite deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting favorite' });
    }
});

module.exports = router;