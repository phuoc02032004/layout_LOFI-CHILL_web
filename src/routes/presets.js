const express = require('express');
const router = express.Router();
const Presets = require('../models/Presets');

// GET all presets
router.get('/', async (req, res) => {
    try {
        const presets = await Presets.find();
        res.json(presets);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching presets' });
    }
});

// GET a specific preset
router.get('/:id', async (req, res) => {
    try {
        const preset = await Presets.findById(req.params.id);
        if (!preset) {
            return res.status(404).json({ error: 'Preset not found' });
        }
        res.json(preset);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching preset' });
    }
});

// POST a new preset
router.post('/', async (req, res) => {
    try {
        const newPreset = new Presets(req.body);
        const savedPreset = await newPreset.save();
        res.status(201).json(savedPreset);
    } catch (err) {
        res.status(400).json({ error: 'Error creating preset' });
    }
});

// PUT (update) a preset
router.put('/:id', async (req, res) => {
    try {
        const updatedPreset = await Presets.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPreset) {
            return res.status(404).json({ error: 'Preset not found' });
        }
        res.json(updatedPreset);
    } catch (err) {
        res.status(400).json({ error: 'Error updating preset' });
    }
});

// DELETE a preset
router.delete('/:id', async (req, res) => {
    try {
        const deletedPreset = await Presets.findByIdAndDelete(req.params.id);
        if (!deletedPreset) {
            return res.status(404).json({ error: 'Preset not found' });
        }
        res.json({ message: 'Preset deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting preset' });
    }
});

module.exports = router;