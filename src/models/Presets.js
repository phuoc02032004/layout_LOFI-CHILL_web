const mongoose = require('mongoose');

const presetsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    soundEffectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SoundEffects' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Presets = mongoose.model('Presets', presetsSchema);

module.exports = Presets;