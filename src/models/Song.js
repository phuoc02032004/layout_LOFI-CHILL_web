const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: String,
    mood: String,
    imageUrl: String,
    audioUrl: { type: String, required: true },
    duration: Number,
    spotifyId: String,
    appleMusicId: String,
    defaultVolume: { type: Number, default: 100 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    albumArt: String,
    releaseDate: Date,
    lyrics: String,
    composer: String,
    language: String,
    explicit: Boolean,
    popularity: Number,
    tags: [String]
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;