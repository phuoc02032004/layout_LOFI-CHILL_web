const express = require('express');
const router = express.Router();
const SoundEffects = require('../models/SoundEffects');

// GET all sound effects
router.get('/', async (req, res) => {
    try {
        const soundEffects = await SoundEffects.find();
        res.json(soundEffects);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching sound effects' });
    }
});

// GET a specific sound effect
router.get('/:id', async (req, res) => {
    try {
        const soundEffect = await SoundEffects.findById(req.params.id);
        if (!soundEffect) {
            return res.status(404).json({ error: 'Sound effect not found' });
        }
        res.json(soundEffect);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching sound effect' });
    }
});

// POST a new sound effect
router.post('/', async (req, res) => {
    try {
        const newSoundEffect = new SoundEffects(req.body);
        const savedSoundEffect = await newSoundEffect.save();
        res.status(201).json(savedSoundEffect);
    } catch (err) {
        res.status(400).json({ error: 'Error creating sound effect' });
    }
});

// PUT (update) a sound effect
router.put('/:id', async (req, res) => {
    try {
        const updatedSoundEffect = await SoundEffects.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSoundEffect) {
            return res.status(404).json({ error: 'Sound effect not found' });
        }
        res.json(updatedSoundEffect);
    } catch (err) {
        res.status(400).json({ error: 'Error updating sound effect' });
    }
});

// DELETE a sound effect
router.delete('/:id', async (req, res) => {
    try {
        const deletedSoundEffect = await SoundEffects.findByIdAndDelete(req.params.id);
        if (!deletedSoundEffect) {
            return res.status(404).json({ error: 'Sound effect not found' });
        }
        res.json({ message: 'Sound effect deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting sound effect' });
    }
});

module.exports = router;