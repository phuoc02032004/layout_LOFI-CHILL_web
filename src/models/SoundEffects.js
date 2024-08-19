const mongoose = require('mongoose');

const soundEffectsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    audioUrl: { type: String, required: true },
    defaultVolume: { type: Number, default: 50 },
    category: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    presetIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Presets' }]
});

const SoundEffects = mongoose.model('SoundEffects', soundEffectsSchema);

module.exports = SoundEffects;